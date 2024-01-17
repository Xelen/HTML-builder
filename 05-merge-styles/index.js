const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles'); // путь к директории с файлами css
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css'); // путь к файлу с общими стилями в новой диреткории

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesDir); // читаем файлы из первой директории, получаем список файлов
    const cssFiles = files.filter((file) => path.extname(file) === '.css'); // выбираем только файлы с расширением css и складываем в cssFiles

    let styles = ''; // задаем пустую переменную, куда сгрузим все содержимое файлов из cssFiles
    for (const file of cssFiles) {
      //проход по каждому файлу
      const filePath = path.join(stylesDir, file); // берем патч на файл
      const data = await fs.readFile(filePath, 'utf8'); // читаем этот файл
      styles += data + '\n'; // добавляем содержимое  в переменную
    }
    // console.log(styles);
    await fs.writeFile(outputFilePath, styles); //пишем содержимое переменной styles  в новый файл
    console.log('Styles merged into bundle.css');
  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles(); //вызываем функцию
