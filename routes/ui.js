const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const storage = require('../middleware/storage');
const Book = require('../middleware/Book');
const upload = require('../middleware/upload');

router.get('/', (req, res) => {
  res.redirect('/books');
});

router.get('/books', (req, res) => {
  res.render('books/index', { books: storage.books });
});

router.get('/books/new', (req, res) => {
  res.render('books/create');
});

router.post('/books', upload, (req, res) => {
  const { title, description, authors, fileCover, fileName } = req.body;
  const favorite = req.body.favorite === 'true' || req.body.favorite === 'on';
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
  res.redirect('/books');
});

router.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = storage.books.find((el) => el.id === id);
  if (!book) {
    res.status(404).render('error', { message: 'Книга не найдена' });
  } else {
    res.render('books/view', { book });
  }
});

router.get('/books/:id/edit', (req, res) => {
  const { id } = req.params;
  const book = storage.books.find((el) => el.id === id);
  if (!book) {
    res.status(404).render('error', { message: 'Книга не найдена' });
  } else {
    res.render('books/update', { book });
  }
});

router.post('/books/:id', upload, (req, res) => {
  const { id } = req.params;
  const idx = storage.books.findIndex((el) => el.id === id);
  if (idx === -1) {
    res.status(404).render('error', { message: 'Книга не найдена' });
    return;
  }
  const { title, description, authors, fileCover, fileName } = req.body;
  const favorite = req.body.favorite === 'true' || req.body.favorite === 'on';
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
  res.redirect('/books/' + id);
});

router.post('/books/:id/delete', (req, res) => {
  const { id } = req.params;
  const idx = storage.books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    storage.books.splice(idx, 1);
  }
  res.redirect('/books');
});

router.get('/books/:id/download', (req, res) => {
  const { id } = req.params;
  const book = storage.books.find((el) => el.id === id);
  if (!book) {
    return res.status(404).render('error', { message: 'Книга не найдена' });
  }
  if (!book.fileBook) {
    return res
      .status(404)
      .render('error', { message: 'Файл книги отсутствует' });
  }
  const filePath = path.join(__dirname, '../uploads', book.fileBook);
  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .render('error', { message: 'Файл не найден на сервере' });
  }
  const originalName = book.fileName || book.fileBook;
  res.download(filePath, originalName, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .render('error', { message: 'Ошибка при скачивании файла' });
    }
  });
});

module.exports = router;
