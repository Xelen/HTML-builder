const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function clearDir(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (let entry of entries) {
    const currentPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await clearDir(currentPath);
      await fs.rmdir(currentPath);
    } else {
      await fs.unlink(currentPath);
    }
  }
}

async function main() {
  try {
    const distDir = path.join(__dirname, 'project-dist');
    if (await exists(distDir)) {
      await clearDir(distDir);
    }
    await fs.mkdir(distDir, { recursive: true });

    const templatePath = path.join(__dirname, 'template.html');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentsDir = path.join(__dirname, 'components');
    const componentFiles = await fs.readdir(componentsDir);

    for (const file of componentFiles) {
      if (path.extname(file) === '.html') {
        const name = path.basename(file, '.html');
        const componentContent = await fs.readFile(
          path.join(componentsDir, file),
          'utf-8',
        );
        const regex = new RegExp(`{{${name}}}`, 'g');
        templateContent = templateContent.replace(regex, componentContent);
      }
    }

    const indexPath = path.join(distDir, 'index.html');
    await fs.writeFile(indexPath, templateContent);

    const stylesDir = path.join(__dirname, 'styles');
    const files = await fs.readdir(stylesDir);
    let stylesContent = '';

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const filePath = path.join(stylesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        stylesContent += content + '\n';
      }
    }

    const stylesPath = path.join(distDir, 'style.css');
    await fs.writeFile(stylesPath, stylesContent);

    const assetsSrcPath = path.join(__dirname, 'assets');
    const assetsDestPath = path.join(distDir, 'assets');
    await copyDir(assetsSrcPath, assetsDestPath);
  } catch (err) {
    console.error(err);
  }
}
async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
main();
