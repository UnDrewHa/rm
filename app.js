const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const RouterMap = require('./router');
const {commonHTTPCodes} = require('./common/errors');
const {errorMiddleware} = require('./common/errors');

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
                callback(
                    new AppError(
                        'Not allowed by CORS',
                        commonHTTPCodes.FORBIDDEN,
                    ),
                );
            }
        },
        optionsSuccessStatus: 200,
        credentials: true,
    }),
);
app.use(RouterMap);
app.use(errorMiddleware);

module.exports = app;
