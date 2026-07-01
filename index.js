const express = require('express');
const path = require('path');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const uiRouter = require('./routes/ui');
const error404 = require('./middleware/err-404');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);

app.use('/', uiRouter);

app.use(error404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
