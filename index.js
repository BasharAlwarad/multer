const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.status(201).send('Image uploaded successfully');
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
