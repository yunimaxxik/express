const express = require('express');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const error404 = require('./middleware/err-404');

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);

app.use(error404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
