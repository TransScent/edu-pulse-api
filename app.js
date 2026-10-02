require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const corsMiddleware = require('./common/middleware/cors');
const app = express();

// Add controllers 
app.use(corsMiddleware.cors);
app.use(cors());

app.use(bodyParser.json({
  limit: "50mb"
}));

const indexRouter= require('./routes/index');
const v1Router = require('./routes/routers');

// app.options('*', (req, res) => { res.status(200).end(); });

app.use('/', indexRouter);
app.use('/edu-pulse/api/v1', v1Router);


app.use('/', (req, res) => {
  res.status(500).json({ code: 500, message: 'API is running, endpoint ' + req.path + ' not found' });
});

app.set('port', (process.env.PORT || 8004));

 module.exports = app;