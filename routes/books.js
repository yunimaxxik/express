const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const storage = require('../middleware/storage');
const Book = require('../middleware/Book');
const upload = require('../middleware/upload');

router.get('/', (req, res) => {
  res.json(storage.books);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const book = storage.books.find((el) => el.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json('404 | страница не найдена');
  }
});

router.post('/', upload, (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const fileBook = req.file ? req.file.filename : '';

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );

  storage.books.push(newBook);
  res.status(201).json(newBook);
});

router.put('/:id', upload, (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const idx = storage.books.findIndex((el) => el.id === id);
  if (idx === -1) {
    return res.status(404).json('404 | страница не найдена');
  }

  const fileBook = req.file ? req.file.filename : storage.books[idx].fileBook;

  storage.books[idx] = {
    ...storage.books[idx],
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  };

  res.json(storage.books[idx]);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const idx = storage.books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    storage.books.splice(idx, 1);
    res.json('ok');
  } else {
    res.status(404).json('404 | страница не найдена');
  }
});

router.get('/:id/download', (req, res) => {
  const { id } = req.params;
  const book = storage.books.find((el) => el.id === id);

  if (!book) {
    return res.status(404).json('404 | книга не найдена');
  }

  if (!book.fileBook) {
    return res.status(404).json('404 | файл книги отсутствует');
  }

  const filePath = path.join(__dirname, '../uploads', book.fileBook);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json('404 | файл не найден на сервере');
  }

  const originalName = book.fileName || book.fileBook;
  res.download(filePath, originalName, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json('Ошибка при скачивании файла');
    }
  });
});

module.exports = router;
