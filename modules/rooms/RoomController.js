const {difference, isEmpty} = require('lodash');
const fs = require('fs');
const util = require('util');
const sharp = require('sharp');
const RoomModel = require('./RoomModel');
const EventModel = require('../events/EventModel');
const {commonErrors, commonHTTPCodes} = require('../../common/errors');
const {
    catchAsync,
    getFieldsFromObject,
} = require('../../common/utils/controllersUtils');
const {AppError} = require('../../common/errors');
const {logger} = require('../../core/Logger');

const unlinkFile = util.promisify(fs.unlink);

/**
 * Контроллер создания документа "Переговорная комната".
 */
exports.create = catchAsync(async function (req, res) {
    const room = await RoomModel.create(
        getFieldsFromObject(req.body.data, [
            'name',
            'description',
            'seats',
            'floor',
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'building',
            'photos',
        ]),
    );

    res.status(201).send({
        data: room,
    });
});

/**
 * Контроллер получения списка документов "Переговорная комната".
 */
exports.getAll = catchAsync(async function (req, res) {
    const {filter} = req.body.data;
    const findFilter = filter ? RoomModel.getRoomsFilter(filter) : {};
    const rooms = await RoomModel.find(findFilter);

    if (!filter || rooms.length === 0 || !filter.notReserved) {
        return res.status(200).send({
            data: rooms,
        });
    }

    const ids = rooms.map((item) => item._id);
    const events = await EventModel.find(
        EventModel.getReservedEventsFilter({
            ids,
            date: filter.date,
            from: filter.from,
            to: filter.to,
        }),
    );

    const notReservedRooms = RoomModel.getNotReservedRooms(rooms, events);

    res.status(200).json({
        data: notReservedRooms,
    });
});

/**
 * Контроллер получения детальной информации документа "Переговорная комната".
 */
exports.getDetails = catchAsync(async function (req, res, next) {
    const {id} = req.params;

    const room = await RoomModel.findById(id);
    if (!room) {
        return next(
            new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND),
        );
    }

    await RoomModel.populate(room, {path: 'building'});

    res.status(200).send({
        data: room,
    });
});

/**
 * Контроллер удаления документов "Переговорная комната".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;
    const rooms = await RoomModel.find({_id: {$in: ids}});

    await RoomModel.deleteMany({
        _id: {$in: ids},
    });

    const photos = rooms.reduce((arr, current) => {
        arr =
            current.photos && !isEmpty(current.photos)
                ? arr.concat(current.photos)
                : arr;

        return arr;
    }, []);

    Promise.all(
        photos.map((path) => unlinkFile(process.env.STATIC_PATH + path)),
    )
        .then((_) => logger.info('Файлы удалены'))
        .catch((err) => logger.error('Ошибка удаления файлов', err));

    res.status(200).send({
        data: rooms.map((item) => item._id),
    });
});

/**
 * Контроллер обновление документа "Переговорная комната".
 */
exports.update = catchAsync(async function (req, res) {
    const {_id} = req.body.data;
    const data = getFieldsFromObject(req.body.data, [
        'name',
        'description',
        'seats',
        'floor',
        'tv',
        'projector',
        'whiteboard',
        'flipchart',
        'building',
        'photos',
    ]);
    const room = await RoomModel.findById(_id);
    const NEED_TO_DELETE_PHOTOS =
        Array.isArray(room.photos) &&
        !isEmpty(room.photos) &&
        Array.isArray(data.photos);

    const updated = await RoomModel.findOneAndUpdate({_id: _id}, data, {
        new: true,
    });

    if (NEED_TO_DELETE_PHOTOS) {
        Promise.all(
            difference(room.photos, data.photos).map((src) =>
                unlinkFile(process.env.STATIC_PATH + src),
            ),
        )
            .then((_) => logger.info('Фото комнаты успешно удалены'))
            .catch((err) => logger.error('Ошибка удаления фото комнаты', err));
    }

    res.status(200).send({
        data: updated,
    });
});

/**
 * Контроллер удаления пользователя.
 */
exports.getFavourites = catchAsync(async function (req, res) {
    const {user} = res.locals;
    const rooms = await RoomModel.find({_id: {$in: user.favouriteRooms}});

    res.status(200).json({
        data: rooms,
    });
});

//TODO: убрать URL.
exports.resizeAndSavePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const filename = `room-${Date.now()}.jpeg`;
    const path = `${process.env.STATIC_PATH}/img/${filename}`;
    const pathWithoutPublic = path.replace(process.env.STATIC_PATH, '');

    req.file.filename = filename;

    await sharp(req.file.buffer)
        .resize(800, 450)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(path);

    res.status(200).json({
        data: pathWithoutPublic,
    });
});
