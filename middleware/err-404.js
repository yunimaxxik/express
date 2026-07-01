module.exports = (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.render('error', { message: 'Страница не найдена' });
  } else {
    res.json('404 | страница не найдена');
  }
};
