const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
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

app.get('/', (req, res) => {
  res.send('Welcome to Multer!');
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.status(201).send('Image uploaded successfully');
});

app.get('/images', (req, res) => {
  fs.readdir('./images', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const images = files.map((file) => `/images/${file}`);
    res.render('images', { images });
  });
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(8000, () => {
  console.log('Server on  http://localhost:8000');
});
