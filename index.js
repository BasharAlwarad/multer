import express, { json } from 'express';
import { join, extname, dirname } from 'path';
import multer, { diskStorage } from 'multer';
import { readdir } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { config } from 'dotenv';

config();
const PORT = process.env.PORT;
const app = express();
app.use(json(), cors({ origin: '*' }));

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
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
  res.status(201).send('Image uploaded successfully');
});

app.get('/images', (req, res) => {
  readdir('./images', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const images =
      files && files.length ? files.map((file) => `/images/${file}`) : [];
    res.render('images', { images });
  });
});

app.use('/images', express.static(join(__dirname, 'images')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
