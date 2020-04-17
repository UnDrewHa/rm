const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/UserModel');
const {catchAsync, createAndSendToken} = require('../utils/controllersUtils');
const {sendEmail} = require('../service/EmailTransport');

/**
 * Контроллер регистрации пользователя.
 */
exports.signup = catchAsync(async function (req, res) {
    //TODO: Убрать прямую передачу body в методы create. Заменить на getFieldsFromReqBody
    const user = await UserModel.create(req.body.data);

    createAndSendToken(res, 201, user);
});

/**
 * Контроллер входа пользователя в систему.
 */
exports.login = catchAsync(async function (req, res) {
    const {user} = res.locals;

    createAndSendToken(res, 200, user);
});

/**
 * Проверка пользователя на авторизацию для предоставления доступа к роуту.
 */
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

    res.locals.user = user;

    next();
});

/**
 * Проверка роли пользователя для предоставления доступа к роуту.
 *
 * @param {Array<string>} roles Список ролей.
 */
exports.restrictedTo = function (roles) {
    return function (req, res, next) {
        if (!roles.includes(res.locals.user.role)) {
            return next(
                new Error('Ваш уровень доступа не соответствует необходимому'),
            );
        }

        next();
    };
};

/**
 * Контроллер забытого пароля.
 */
exports.forgot = catchAsync(async function (req, res, next) {
    const {email} = req.body.data;

    if (!email) {
        return next(new Error('Введите корректный e-mail адрес'));
    }

    const user = await UserModel.findOne({email});
    if (!user) {
        return next(
            new Error('Пользователь с указанным e-mail адресом не найден'),
        );
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
        await user
            .clearTokensInfo(resetToken)
            .save({validateBeforeSave: false});

        return next(new Error('Ошибка отправки сообщения с токеном'));
    }

    res.status(200).json({
        data: resetToken,
    });
});

/**
 * Контроллер сброса пароля пользователя.
 */
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
            new Error(
                'Вы ввели невалидную или протухшую ссылку для сброса пароля',
            ),
        );
    }

    user.password = req.body.data.password;
    user.passwordConfirm = req.body.data.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    createAndSendToken(res, 200, user);
});
