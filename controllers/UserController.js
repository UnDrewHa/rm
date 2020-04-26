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

        //TODO Сделать нормально.
        user.password = undefined;

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
    await user.save();

    createAndSendToken(res, 200, user);
});

/**
 * Контроллер обновления данных пользователя.
 */
exports.updateMe = catchAsync(async function (req, res) {
    const {user} = res.locals;
    const userData = getFieldsFromObject(req.body.data, [
        'email',
        'phone',
        'building',
        'photo',
        'name',
        'surname',
        'patronymic',
        'active',
        'newPassword',
    ]);

    user.email = userData.email || user.email;
    user.phone = userData.phone || user.phone;
    user.building = userData.building || user.building;
    user.photo = userData.photo || user.photo;
    user.name = userData.name || user.name;
    user.surname = userData.surname || user.surname;
    user.patronymic = userData.patronymic || user.patronymic;
    user.active = userData.active || user.active;

    if (userData.newPassword) {
        user.password = userData.newPassword;
        user.passwordConfirm = userData.newPassword;
    }
    await user.save();

    if (userData.newPassword) {
        createAndSendToken(res, 200, user);
    }

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
 * Контроллер удаления пользователя.
 */
exports.getUserInfo = catchAsync(async function (req, res) {
    const {user} = res.locals;

    res.status(200).json({
        data: user,
    });
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

exports.toggleFavourite = catchAsync(async function (req, res, next) {
    const {user} = res.locals;
    const {roomId, type} = req.body.data;

    if (!type || !['on', 'off'].includes(type)) {
        return next(new AppError('Необходимо указать тип действия'));
    }

    let action = {$push: {favouriteRooms: roomId}};

    if (type === 'off') {
        action = {$pull: {favouriteRooms: roomId}};
    }

    const updated = await UserModel.findOneAndUpdate({_id: user._id}, action, {
        new: true,
    });

    res.status(200).send({
        data: updated,
    });
});
