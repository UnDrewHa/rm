const {AppError} = require('./AppError');
const {errorHandler} = require('../../core/ErrorHandler');
const {commonHTTPCodes, commonErrors} = require('./maps');

/**
 * Сформировать текст ошибки обязательного заполнения поля.
 *
 * @param {string} fieldName Название поля на русском.
 *
 * @returns {string} Текст ошибки.
 */
exports.getFieldErrorMessage = function (fieldName = '') {
    return `Поле "${fieldName}" обязательно для заполнения`;
};

exports.errorMiddleware = (error, req, res, next) => {
    let errorObj = {
        status: error.status,
        message: error.message,
    };

    if (process.env.NODE_ENV === 'development') {
        errorObj = {
            status: error.status,
            message: error.message,
            stack: error.stack,
            error,
        };
    }

    errorHandler.handleError(errorObj);

    res.status(error.statusCode || 500).json({
        error: errorObj,
    });
};

exports.notFoundMiddleware = (req, res, next) => {
    next(new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND));
};

exports.handleUnhandled = (server) => (error) => {
    errorHandler.handleError(error);

    server.close(() => {
        process.exit(1);
    });
};
