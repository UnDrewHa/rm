exports.AppError = class extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.status = 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
};
