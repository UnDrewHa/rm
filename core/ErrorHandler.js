const {logger} = require('./Logger');

function ErrorHandler() {
    this.handleError = async (err) => {
        logger.log('error', 'error', err);
    };
}

exports.errorHandler = new ErrorHandler();
