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
