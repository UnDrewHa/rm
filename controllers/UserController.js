const UserModel = require('../models/UserModel');
const {
  catchAsync,
  getFieldsFromReqBody,
  createAndSendToken,
} = require('../utils/controllersUtils');

/**
 * Middleware для проверки корректности введенного пароля перед изменением данных пользователя.
 *
 * @param {string} fieldName Поле, которое получаем от пользователя помимо пароля.
 */
exports.createPasswordCheckMiddleware = function (fieldName) {
  return catchAsync(async function (req, res, next) {
    const {[fieldName]: fieldValue, password} = req.body;

    if (!fieldValue || !password) {
      return next(new Error('Необходимо указать пароль для изменения данных'));
    }

    const user = await UserModel.findOne({
      [fieldName]: req.body[fieldName],
    }).select('+password');
    const CORRECT_PASSWORD =
      user && (await user.checkPassword(password, user.password));

    if (!user || !CORRECT_PASSWORD) {
      return next(new Error('Неверный логин или пароль'));
    }

    res.locals.user = user;

    next();
  });
};

/**
 * Контроллер изменения пароля.
 */
exports.changePassword = catchAsync(async function (req, res, next) {
  const {newPassword, newPasswordConfirm} = req.body;
  const {user} = res.locals;

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.save();

  createAndSendToken(res, 200, user);

  next();
});

/**
 * Контроллер обновления данных пользователя.
 */
exports.updateMe = catchAsync(async function (req, res, next) {
  const {user} = res.locals;

  await user.update(
    //TODO: Перенести ключи в константы.
    getFieldsFromReqBody(req.body, [
      'email',
      'phone',
      'building',
      'photo',
      'name',
      'surname',
      'patronymic',
    ]),
    {
      runValidators: true,
    },
  );

  res.status(200).send({
    status: 'success',
  });

  next();
});

/**
 * Контроллер удаления пользователя.
 */
exports.deleteMe = catchAsync(async function (req, res, next) {
  const {user} = res.locals;

  await user.update(
    {active: false},
    {
      runValidators: true,
    },
  );

  res.status(200).send({
    status: 'success',
  });

  next();
});

/**
 * Контроллер получения списка пользователей.
 */
exports.getUsers = catchAsync(async function (req, res, next) {
  const users = await UserModel.find();

  res.status(200).send({
    status: 'success',
    data: {
      users,
    },
  });

  next();
});
