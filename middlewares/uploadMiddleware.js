// middlewares/dynamicUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getStorage = (folder) => {
  const uploadPath = path.join(__dirname, `../uploads/${folder}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
  cb(null, isValid);
};

const getUploader = (folder) =>
  multer({ storage: getStorage(folder), fileFilter });

module.exports = getUploader;
