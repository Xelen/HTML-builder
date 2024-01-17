const fs = require('fs').promises;
const path = require('path');

async function createCopyDirectory() {
  const copyDirPath = path.join(__dirname, 'files-copy');
  await fs.mkdir(copyDirPath, { recursive: true });
}
async function readFilesDirectory() {
  const filesDirPath = path.join(__dirname, 'files');
  return fs.readdir(filesDirPath);
}
async function copyFiles(files) {
  const filesDirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');

  for (const file of files) {
    const sourceFilePath = path.join(filesDirPath, file);
    const destFilePath = path.join(copyDirPath, file);
    await fs.copyFile(sourceFilePath, destFilePath);
  }
}
async function copyDir() {
  await createCopyDirectory();
  const files = await readFilesDirectory();
  await copyFiles(files);
}

copyDir()
  .then(() => console.log('Скопировано успешно.'))
  .catch((err) => console.error('Ошибка в копировании:', err));
