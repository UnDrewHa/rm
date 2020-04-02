const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/UserModel');
const {catchAsync} = require('../utils/errorUtils');
const {sendEmail} = require('../service/EmailTransport');

exports.signup = catchAsync(async function (req, res, next) {
  //TODO: Убрать прямую передачу body в методы create.
  const user = await UserModel.create(req.body);

  const token = user.getToken(user);

  res.status(201).json({
    status: 'success',
    data: {
      token,
    },
  });

  next();
});

exports.login = catchAsync(async function (req, res, next) {
  const {login, password} = req.body;

  if (!login || !password) {
    return next(new Error('Необходимо указать логин или пароль'));
  }

  const user = await UserModel.findOne({login}).select('+password');
  const CORRECT_PASSWORD =
    user && (await user.checkPassword(password, user.password));

  if (!user || !CORRECT_PASSWORD) {
    return next(new Error('Неверный логин или пароль'));
  }

  const token = user.getToken(user);

  //TODO: сделать метод хелпер для формирования ответов
  res.status(200).send({
    status: 'success',
    data: {
      token,
    },
  });

  next();
});

exports.protect = catchAsync(async function (req, res, next) {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  if (!token) {
    return next(new Error('Вам необходимо авторизоваться в приложении'));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decodedData.id);
  if (!user) {
    return next(
      new Error(
        'Такого пользователя больше не существует. Вам необходимо пройти регистрацию заново',
      ),
    );
  }

  if (user.passwordChangedAfter(decodedData.iat)) {
    return next(new Error('Вам необходимо произвести вход'));
  }

  req.user = user;

  next();
});

exports.restrictedTo = function (roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error('Ваш уровень доступа не соответствует необходимому'),
      );
    }

    next();
  };
};

exports.forgot = catchAsync(async function (req, res, next) {
  const {email} = req.body;

  if (!email) {
    return next(new Error('Введите корректный e-mail адрес'));
  }

  const user = await UserModel.findOne({email});
  if (!user) {
    return next(new Error('Пользователь с указанным e-mail адресом не найден'));
  }

  const resetToken = user.getResetToken();
  await user.setTokensInfo(resetToken).save({validateBeforeSave: false});

  try {
    await sendEmail({
      to: email,
      subject: 'Password reset',
      text: `Your reset token - ${resetToken}`,
    });
  } catch (e) {
    await user.clearTokensInfo(resetToken).save({validateBeforeSave: false});

    return next(new Error('Ошибка отправки сообщения с токеном'));
  }

  res.status(200).send(resetToken);

  next();
});

exports.reset = catchAsync(async function (req, res, next) {
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    passwordResetExpires: {$gt: Date.now()},
    passwordResetToken,
  });

  if (!user) {
    return next(
      new Error('Вы ввели невалидную или протухшую ссылку для сброса пароля'),
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  const token = user.getToken(user);

  //TODO: сделать метод хелпер для формирования ответов
  res.status(200).send({
    status: 'success',
    data: {
      token,
    },
  });

  next();
});
