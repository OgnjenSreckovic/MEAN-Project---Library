import multer from 'multer';

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'books');
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    const fileType = mimeType[1];
    const fileName = file.originalname + '.' + fileType;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storageBooks = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
  'image'
);

export default storageBooks;