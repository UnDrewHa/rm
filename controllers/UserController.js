const UserModel = require('../models/UserModel');
const {
    catchAsync,
    getFieldsFromObject,
    createAndSendToken,
} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Middleware для проверки корректности введенного пароля перед изменением данных пользователя.
 *
 * @param {string} key Поле, которое получаем от пользователя помимо пароля.
 */
exports.createPasswordCheckMiddleware = function (key) {
    return catchAsync(async function (req, res, next) {
        const {[key]: fieldValue, password} = req.body.data;

        if (!fieldValue || !password) {
            return next(
                new Error('Необходимо указать пароль для изменения данных'),
            );
        }

        const user = await UserModel.findOne({
            [key]: req.body.data[key],
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
exports.changePassword = catchAsync(async function (req, res) {
    const {newPassword, newPasswordConfirm} = req.body.data;
    const {user} = res.locals;

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.save();

    createAndSendToken(res, 200, user);
});

/**
 * Контроллер обновления данных пользователя.
 */
exports.updateMe = catchAsync(async function (req, res) {
    const {user} = res.locals;

    await user.update(
        //TODO: Перенести ключи в константы.
        getFieldsFromObject(req.body.data, [
            'email',
            'phone',
            'building',
            'photo',
            'name',
            'surname',
            'patronymic',
            'active',
        ]),
        {
            runValidators: true,
        },
    );

    res.status(200).send();
});

/**
 * Контроллер удаления пользователя.
 */
exports.deleteMe = catchAsync(async function (req, res) {
    const {user} = res.locals;

    await user.update(
        {active: false},
        {
            runValidators: true,
        },
    );

    res.status(200).send();
});

/**
 * Контроллер получения списка пользователей.
 */
exports.getAll = catchAsync(async function (req, res) {
    const users = await UserModel.find();

    res.status(200).send({
        data: users,
    });
});

/**
 * Контроллер удаления документов "Пользователь".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    await UserModel.updateMany(
        {
            _id: {$in: ids},
        },
        {active: false},
        {
            runValidators: true,
        },
    );

    res.status(200).send();
});

/**
 * Контроллер обновление документа "Пользователь".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;

    const user = await UserModel.findById(_id);
    if (!user) {
        return next(new AppError('Документ не найден', 404));
    }

    await user.update(
        getFieldsFromObject(req.body.data, [
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

    res.status(200).send();
});

/**
 * Контроллер создания документа "Пользователь".
 */
exports.create = catchAsync(async function (req, res) {
    const newUserData = {
        password: process.env.DEFAULT_PASSWORD,
        passwordConfirm: process.env.DEFAULT_PASSWORD,
        ...getFieldsFromObject(req.body.data, [
            'login',
            'email',
            'phone',
            'building',
            'photo',
            'name',
            'surname',
            'patronymic',
        ]),
    };
    const room = await UserModel.create(newUserData);

    res.status(201).send({
        data: room,
    });
});
