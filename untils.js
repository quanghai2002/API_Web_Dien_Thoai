// const multer = require('multer');
import multer from 'multer';
// const path = require('path'); // Thêm dòng này
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // console.log({ file })
    cb(null, file.fieldname + '-' + Date.now() + Math.ceil(Math.random() * 1000000) + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;