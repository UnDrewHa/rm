const fs = require('fs');
const util = require('util');
const {get} = require('lodash');
const sharp = require('sharp');
const UserModel = require('./UserModel');
const {commonHTTPCodes} = require('../../common/errors');
const {
    catchAsync,
    getFieldsFromObject,
} = require('../../common/utils/controllersUtils');
const {AppError} = require('../../common/errors');
const {logger} = require('../../core/Logger');

const unlinkFile = util.promisify(fs.unlink);

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
                new AppError(
                    'Необходимо указать пароль для изменения данных',
                    commonHTTPCodes.BAD_REQUEST,
                ),
            );
        }

        const user = await UserModel.findOne({
            [key]: req.body.data[key],
        }).select('+password');
        const CORRECT_PASSWORD =
            user && (await user.checkPassword(password, user.password));

        if (!user || !CORRECT_PASSWORD) {
            return next(
                new AppError(
                    'Неверный логин или пароль',
                    commonHTTPCodes.BAD_REQUEST,
                ),
            );
        }

        res.locals.user = user;

        next();
    });
};

/**
 * Контроллер изменения пароля.
 */
exports.changePassword = catchAsync(async function (req, res, next) {
    const {newPassword, newPasswordConfirm} = req.body.data;
    const {user} = res.locals;

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    res.locals.user = user;
    next();
});

/**
 * Контроллер обновления данных пользователя.
 */
exports.updateMe = catchAsync(async function (req, res, next) {
    const {user} = res.locals;
    const userData = getFieldsFromObject(req.body.data, [
        'email',
        'phone',
        'building',
        'name',
        'surname',
        'patronymic',
        'active',
        'newPassword',
        'login',
    ]);

    user.email = userData.email || user.email;
    user.phone = userData.phone || user.phone;
    user.building = userData.building || user.building;
    user.name = userData.name || user.name;
    user.surname = userData.surname || user.surname;
    user.patronymic = userData.patronymic || user.patronymic;
    user.active = userData.active || user.active;

    if (userData.newPassword) {
        user.password = userData.newPassword;
        user.passwordConfirm = userData.newPassword;

        await user.save();

        res.locals.user = user;
        next();
    }

    const updated = await UserModel.findOneAndUpdate(
        {_id: user._id},
        userData,
        {new: true},
    );

    res.status(200).send({
        data: updated,
    });
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
exports.getUserInfo = function (req, res) {
    const {user} = res.locals;

    res.status(200).json({
        data: user,
    });
};

/**
 * Контроллер удаления пользователя.
 */
exports.getById = catchAsync(async function (req, res) {
    const {id} = req.params;
    const user = await UserModel.findById(id);

    res.status(200).json({
        data: user,
    });
});

/**
 * Контроллер получения списка пользователей.
 */
exports.find = catchAsync(async function (req, res) {
    const filter = get(req.body.data, 'filter', {});

    const users = await UserModel.find(filter);

    res.status(200).send({
        data: users,
    });
});

/**
 * Контроллер удаления документов "Пользователь".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    const users = await UserModel.find({_id: {$in: ids}});

    await UserModel.deleteMany({
        _id: {$in: ids},
    });

    const usersPhoto = users.map((item) => item.photo).filter((item) => !!item);

    Promise.all(
        usersPhoto.map((path) => unlinkFile(process.env.STATIC_PATH + path)),
    )
        .then((_) => logger.info('Фото профиля успешно удалены'))
        .catch((err) => logger.error('Ошибка удаления фото профиля', err));

    res.status(200).send({
        data: users.map((item) => item._id),
    });
});

/**
 * Контроллер обновление документа "Пользователь".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;
    const data = getFieldsFromObject(req.body.data, [
        'email',
        'login',
        'building',
        'role',
        'active',
    ]);

    const updated = await UserModel.findOneAndUpdate({_id}, data, {
        new: true,
    });

    res.status(200).send({
        data: updated,
    });
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
            'building',
            'role',
            'active',
        ]),
    };
    const user = await UserModel.create(newUserData);

    res.status(201).send({
        data: user,
    });
});

exports.toggleFavourite = catchAsync(async function (req, res, next) {
    const {user} = res.locals;
    const {roomId, type} = req.body.data;

    if (!type || !['on', 'off'].includes(type)) {
        return next(
            new AppError(
                'Необходимо указать тип действия',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
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

exports.resizeAndSavePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const {user} = res.locals;
    const oldPhoto = user.photo;
    const filename = `${user._id}-${Date.now()}.jpeg`;
    const path = `${process.env.STATIC_PATH}/img/${filename}`;
    const pathWithoutPublic = path.replace(process.env.STATIC_PATH, '');

    req.file.filename = filename;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(path);

    await UserModel.update({_id: user._id}, {photo: pathWithoutPublic});

    if (oldPhoto) {
        unlinkFile(process.env.STATIC_PATH + oldPhoto)
            .then((_) => logger.info('Фото профиля успешно удалены'))
            .catch((err) => logger.error('Ошибка удаления фото профиля', err));
    }

    res.status(200).json({
        data: pathWithoutPublic,
    });
});
