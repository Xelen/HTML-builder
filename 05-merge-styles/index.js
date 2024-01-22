const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesDir); // читаем файлы из первой директории, получаем список файлов
    const cssFiles = files.filter((file) => path.extname(file) === '.css'); // выбираем только файлы с расширением css и складываем в cssFiles

    let styles = '';
    for (const file of cssFiles) {
      //проход по каждому файлу
      const filePath = path.join(stylesDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      styles += data + '\n';
    }

    await fs.writeFile(outputFilePath, styles); //пишем содержимое переменной styles  в новый файл
    console.log('Styles merged into bundle.css');
  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles();
