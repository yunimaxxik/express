const express = require('express');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');

const app = express();

app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
