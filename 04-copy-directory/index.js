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
async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
async function main() {
  const sourceDirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');

  if (await exists(copyDirPath)) {
    await clearDir(copyDirPath);
  }
  await copyDir(sourceDirPath, copyDirPath);

  console.log('Скопировано успешно.');
}

main().catch((err) => console.error('Ошибка в копировании:', err));
