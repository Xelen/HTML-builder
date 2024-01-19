const fs = require('fs').promises;
const path = require('path');

async function createCopyDirectory() {
  const copyDirPath = path.join(__dirname, 'files-copy');
  await fs.mkdir(copyDirPath, { recursive: true });
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

async function readFilesDirectory(directory) {
  return fs.readdir(directory);
}
async function copyFiles(sourceDirPath, copyDirPath, files) {
  for (const file of files) {
    const sourceFilePath = path.join(sourceDirPath, file);
    const destFilePath = path.join(copyDirPath, file);
    await fs.copyFile(sourceFilePath, destFilePath);
  }
}
async function copyDir() {
  const sourceDirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');

  await createCopyDirectory();
  await clearDir(copyDirPath); // Очищаем директорию перед копированием
  const sourceFiles = await readFilesDirectory(sourceDirPath);
  await copyFiles(sourceDirPath, copyDirPath, sourceFiles);
}

copyDir()
  .then(() => console.log('Скопировано успешно.'))
  .catch((err) => console.error('Ошибка в копировании:', err));
