const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AuthController = require('./controllers/AuthController');
const ErrorController = require('./controllers/ErrorController');
const AuthRoute = require('./routes/AuthRoute');
const AdminRoute = require('./routes/AdminRoute');
const UserRoute = require('./routes/UserRoute');
const RoomRoute = require('./routes/RoomRoute');
const EventRoute = require('./routes/EventRoute');
const {AppError} = require('./utils/errorUtils');

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
app.use('/users', AuthController.protect, UserRoute);
app.use('/rooms', AuthController.protect, RoomRoute);
app.use('/events', AuthController.protect, EventRoute);
app.use(
  '/admin',
  AuthController.protect,
  AuthController.restrictedTo(['admin']),
  AdminRoute,
);

app.all('*', (req, res, next) => {
  next(new AppError('404, not found!', 404));
});

app.use(ErrorController.onError);

module.exports = app;
