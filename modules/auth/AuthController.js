const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../users/UserModel');
const {
    catchAsync,
    createAndSendToken,
} = require('../../common/utils/controllersUtils');
const {sendEmail} = require('../emails/EmailTransport');
const {AppError} = require('../../common/utils/errorUtils');

/**
 * Контроллер регистрации пользователя.
 */
exports.signup = catchAsync(async function (req, res) {
    const user = await UserModel.create(
        getFieldsFromReqBody(req.body.data, [
            'login',
            'password',
            'passwordConfirm',
            'email',
            'building',
        ]),
    );

    createAndSendToken(res, 201, user, user);
});

/**
 * Контроллер входа пользователя в систему.
 */
exports.login = catchAsync(async function (req, res) {
    const {user} = res.locals;

    createAndSendToken(res, 200, user, user);
});

/**
 * Проверка пользователя на авторизацию для предоставления доступа к роуту.
 */
exports.protect = catchAsync(async function (req, res, next) {
    const {token} = req.cookies || {};

    if (!token) {
        return next(
            new AppError('Вам необходимо авторизоваться в приложении', 401),
        );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedData.id);
    if (!user) {
        return next(
            new AppError(
                'Такого пользователя больше не существует. Вам необходимо пройти регистрацию заново',
            ),
        );
    }

    if (user.passwordChangedAfter(decodedData.iat)) {
        return next(new AppError('Вам необходимо произвести вход', 401));
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
                new AppError(
                    'Ваш уровень доступа не соответствует необходимому',
                    403,
                ),
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
        return next(new AppError('Введите корректный e-mail адрес'));
    }

    const user = await UserModel.findOne({email});
    if (!user) {
        return next(
            new AppError('Пользователь с указанным e-mail адресом не найден'),
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

        return next(new AppError('Ошибка отправки сообщения с токеном'));
    }

    res.status(200).send();
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
            new AppError(
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
