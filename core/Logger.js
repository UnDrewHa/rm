const {createLogger, format, transports} = require('winston');
const {combine, colorize, timestamp, printf} = format;

const customFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'}),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(colorize(), timestamp(), customFormat),
        }),
    );
}

exports.logger = logger;
