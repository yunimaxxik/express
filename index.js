const express = require('express');
const indexRouter = require('./routes/index');

app.use('/', indexRouter);

const stor = {
  books: []
};

const app = express();
app.use(express.json());

app.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

app.get('/api/books', (req, res) => {
  const { books } = stor;
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404).json('404 | страница не найдена');
  }
});

app.post('/api/books', (req, res) => {
  const { books } = stor;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  } = req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  } = req.body;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook
    };

    res.json(books[idx]);
  } else {
    res.status(404).json('404 | страница не найдена');
  }
});

app.delete('/api/books/:id', (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
    res.json('ok');
  } else {
    res.status(404).json('404 | страница не найдена');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
