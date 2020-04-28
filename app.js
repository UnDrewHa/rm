const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ErrorController = require('./controllers/ErrorController');
const RouterMap = require('./routes');
const {AppError} = require('./utils/errorUtils');

dotenv.config({
    path: './config.env',
});

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/${process.env.PUBLIC_PATH}`));
app.use(cookieParser());

app.use(
    cors({
        origin: function (origin, callback) {
            //TODO: изменить условия CORS.
            if (!origin || origin.includes('localhost')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200,
        credentials: true,
    }),
);

app.use(RouterMap);

app.all('*', (req, res, next) => {
    next(new AppError('404, not found!', 404));
});

app.use(ErrorController.onError);

module.exports = app;
