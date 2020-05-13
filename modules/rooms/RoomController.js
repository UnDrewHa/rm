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
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const qrToDataURL = util.promisify(QRCode.toDataURL);
const unlinkFile = util.promisify(fs.unlink);

/**
 * Контроллер создания документа "Переговорная комната".
 */
exports.create = catchAsync(async function (req, res) {
    const {files} = res.locals;
    const data = getFieldsFromObject(req.body, [
        'name',
        'description',
        'seats',
        'floor',
        'tv',
        'projector',
        'whiteboard',
        'flipchart',
        'building',
        'needApprove',
    ]);

    if (files && files.length > 0) {
        data.photos = files;
    }

    const room = await RoomModel.create(data);

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
    const {files} = res.locals;
    const {_id, uploadedFiles} = req.body;
    const data = {
        ...getFieldsFromObject(req.body, [
            'name',
            'description',
            'seats',
            'floor',
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'needApprove',
            'building',
        ]),
        photos: [
            ...files,
            ...(Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]),
        ].filter((item) => !!item),
    };
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

exports.resizeAndSavePhoto = catchAsync(async (req, res, next) => {
    res.locals.files = [];

    if (!req.files) {
        return next();
    }

    await Promise.all(
        req.files.map((file) => {
            const filename = `room-${Date.now()}.jpeg`;
            const path = `${process.env.STATIC_PATH}/img/${filename}`;
            const pathWithoutPublic = path.replace(process.env.STATIC_PATH, '');

            file.filename = filename;

            return sharp(file.buffer)
                .resize(800, 450)
                .toFormat('jpeg')
                .jpeg({quality: 90})
                .toFile(path)
                .then((result) => {
                    res.locals.files.push(pathWithoutPublic);
                    return result;
                });
        }),
    );

    next();
});

/**
 * Получение QR-кодов со ссылками на переговорные комнаты в формате PDF.
 */
exports.getQrCodesInPdf = catchAsync(async function (req, res, next) {
    const {ids, context = '/#/rooms/'} = req.body.data;

    if (!ids) {
        return next(
            new AppError(
                'Необходимо указать идентификаторы переговорных комнат',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
    }

    const rooms = await RoomModel.find({_id: {$in: ids}});

    if (rooms.length === 0) {
        return next(
            new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND),
        );
    }

    const fileName = '/files/qr-codes.pdf';
    const doc = new PDFDocument({
        size: [595, 842],
        info: {
            Title: 'QR-коды переговорных комнат',
            Author: process.env.ORG_NAME,
        },
    });
    doc.pipe(fs.createWriteStream(process.env.STATIC_PATH + fileName));

    const qrCodes = await Promise.all(
        rooms.map(({_id}) =>
            qrToDataURL(process.env.PRODUCTION_ORIGIN + context + _id, {
                margin: 0,
                color: {
                    dark: '1890ffff',
                },
            }),
        ),
    );

    qrCodes.forEach((code, index) => {
        if (index !== 0) {
            doc.addPage();
        }

        doc.image(process.env.STATIC_PATH + '/img/qr-template.png', 0, 0, {
            width: 595,
        });

        doc.image(code, 95, 205, {width: 405});

        doc.font(process.env.STATIC_PATH + '/fonts/Roboto-Bold.ttf')
            .fontSize(36)
            .fillColor('white')
            .text(rooms[index].name, 36, 34, {
                width: 523,
                lineBreak: false,
                ellipsis: true,
            });

        doc.font(process.env.STATIC_PATH + '/fonts/Roboto-Regular.ttf')
            .fontSize(28)
            .fillColor('black')
            .text('Возникли вопросы?', 36, 680);

        doc.font(process.env.STATIC_PATH + '/fonts/Roboto-Bold.ttf')
            .fontSize(28)
            .fillColor('black')
            .text(process.env.ORG_PHONE, 36, 720);
    });

    doc.end();
    doc.on('end', () => {
        res.status(201).json({
            data: fileName,
        });
    });
});
