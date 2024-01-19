const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Создание потока записи в файл
const outputStream = fs.createWriteStream(path.join(__dirname, 'output.txt'));

// Создание интерфейса readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Введите текст (или введите exit для выхода):');

// Обработка ввода пользователя
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
  } else {
    outputStream.write(input + '\n');
  }
});

// Обработка закрытия readline (например, при вводе 'exit')
rl.on('close', () => {
  console.log('Завершение записи, выход из программы.');
  outputStream.close();
});

// Обработка принудительного завершения процесса (Ctrl + C)
process.on('SIGINT', () => {
  rl.close();
  outputStream.close();
});
