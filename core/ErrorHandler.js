const {logger} = require('./Logger');

function ErrorHandler() {
    this.handleError = async (err) => {
        logger.error('', err);
    };
}

exports.errorHandler = new ErrorHandler();
