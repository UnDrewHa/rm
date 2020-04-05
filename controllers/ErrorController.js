exports.onError = (error, req, res, next) => {
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

  res.status(error.statusCode || 500).send(errorObj);
};
