exports.getFieldErrorMessage = function (fieldName = '') {
  return `Поле "${fieldName}" обязательно для заполнения`;
};

exports.catchAsync = function (fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
