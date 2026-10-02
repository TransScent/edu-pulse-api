var express = require('express');

const router = express.Router();

router.get('/index', (req, res) => {
  res.send({
    application: 'Edu Pulse Service',
    environment: process.env.NODE_ENV,
  }).end();
});

module.exports = router;