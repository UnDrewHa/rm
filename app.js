const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/${process.env.STATIC_PATH}`));
app.use(cookieParser());
app.use(cors(getCorsSettings(IS_DEV_ENV, process.env.PRODUCTION_ORIGIN)));
app.use(RouterMap);
app.use(errorMiddleware);

module.exports = app;
