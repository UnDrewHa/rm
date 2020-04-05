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
