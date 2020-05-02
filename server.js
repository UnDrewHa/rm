const mongoose = require('mongoose');
const app = require('./app');
const {logger} = require('./core/Logger');
const {handleUnhandled} = require('./common/errors');

const key = process.argv.includes('localdb')
    ? 'CONNECTION_STRING_LOCAL'
    : 'CONNECTION_STRING';

const CONNECTION_STRING = process.env[key].replace(
    '<password>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const server = app.listen(process.env.PORT, () => {
    logger.info(`App is running on PORT: ${process.env.PORT}`);
});

process.on('uncaughtException', handleUnhandled(server));
process.on('unhandledRejection', handleUnhandled(server));
