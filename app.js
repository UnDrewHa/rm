const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const RouterMap = require('./router');
const {createFolders} = require('./core/createFolders');
const {getCorsSettings} = require('./core/cors');
const {errorMiddleware} = require('./common/errors');

dotenv.config({
    path: './config.env',
});

const IS_DEV_ENV = process.env.NODE_ENV === 'development';
process.env.STATIC_PATH = IS_DEV_ENV
    ? process.env.PUBLIC_PATH
    : process.env.PUBLIC_PATH_PROD;

createFolders();

const app = express();

if (IS_DEV_ENV) {
    // Логирование HTTP-запросов.
    app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors(getCorsSettings(IS_DEV_ENV, process.env.PRODUCTION_ORIGIN)));

// GZIP
app.use(compression());

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));

app.use(
    express.static(`${__dirname}/${process.env.STATIC_PATH}`, {
        maxAge: 2592000000, //1 month
    }),
);
app.use(cookieParser());

// Чистка приходящих данных от NoSQL инъекций.
app.use(mongoSanitize());

// Чистка приходящих данных от XSS.
app.use(xss());

// Предотвращение получения параметров, направленных на взлом.
app.use(
    hpp({
        whitelist: [],
    }),
);

app.use(RouterMap);
app.use(errorMiddleware);

module.exports = app;
