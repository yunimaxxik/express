const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Library API',
    endpoints: {
      books: '/api/books',
      book: '/api/books/:id',
      download: '/api/books/:id/download',
      user: '/api/user'
    }
  });
});

module.exports = router;
