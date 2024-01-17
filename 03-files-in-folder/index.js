const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExtension = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExtension}`);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      });
    }
  });
});
