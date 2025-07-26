const fs = require('fs');
const path = require('path');

// Create necessary upload directories
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/bills',
    'uploads/hygiene',
    'uploads/reports',
    'uploads/temp'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

module.exports = { createUploadDirs };