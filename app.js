const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AuthRoute = require('./routes/AuthRoute');

dotenv.config({
  path: './config.env',
});

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/auth', AuthRoute);

module.exports = app;
