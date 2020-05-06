const fs = require('fs');
const util = require('util');
const sharp = require('sharp');
const {find} = require('lodash');
const {logger} = require('../../core/Logger');
const BuildingModel = require('./BuildingModel');
const {commonErrors, commonHTTPCodes} = require('../../common/errors');
const {
    catchAsync,
    getFieldsFromObject,
} = require('../../common/utils/controllersUtils');
const {AppError} = require('../../common/errors');

const unlinkFile = util.promisify(fs.unlink);

/**
 * Контроллер создания документа "Здание".
 */
exports.create = catchAsync(async function (req, res) {
    const building = await BuildingModel.create(
        getFieldsFromObject(req.body.data, ['name', 'address', 'floors']),
    );

    res.status(201).send({
        data: building,
    });
});

/**
 * Контроллер получения списка документов "Здание".
 */
exports.getAll = catchAsync(async function (req, res) {
    const buildings = await BuildingModel.find({});

    res.status(200).send({
        data: buildings,
    });
});

/**
 * Контроллер удаления документов "Здание".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    await BuildingModel.deleteMany({
        _id: {$in: ids},
    });

    res.status(200).send({
        data: ids,
    });
});

/**
 * Контроллер обновление документа "Здание".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;

    const building = await BuildingModel.findById(_id);
    if (!building) {
        return next(
            new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND),
        );
    }

    await building.update(
        getFieldsFromObject(req.body.data, ['address', 'name', 'floors']),
        {
            runValidators: true,
        },
    );

    res.status(200).send();
});

exports.updateFloorData = catchAsync(async function (req, res, next) {
    const {_id, roomsData, building} = req.body.data;

    const buildingData = await BuildingModel.findById(building);
    const floorData = _id ? buildingData.floorsData.id(_id) : null;

    if (!floorData) {
        return next(
            new AppError(
                'Не найдены данные по указанному идентификатору этажа',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
    }

    floorData.roomsData = roomsData;

    await buildingData.save();

    res.status(200).json({
        data: floorData,
    });
});

/**
 * Контроллер получения детальной информации документа.
 */
exports.getDetails = catchAsync(async function (req, res, next) {
    const {id} = req.params;

    const data = await BuildingModel.findById(id);
    if (!data) {
        return next(
            new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND),
        );
    }

    res.status(200).send({
        data,
    });
});

exports.getFloorData = catchAsync(async function (req, res, next) {
    const {building, floor} = req.body.data;

    const buildingData = await BuildingModel.findById(building);
    const floorData = find(
        buildingData.floorsData,
        (item) => item.floorNumber === floor,
    );

    res.status(200).send({
        data: floorData || null,
    });
});

exports.resizeAndSavePhoto = catchAsync(async (req, res, next) => {
    if (!req.file)
        return next(
            new AppError(
                'Необходимо загрузить изображение',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );

    const filename = `floor-plan-${Date.now()}.jpeg`;
    const path = `${process.env.STATIC_PATH}/img/${filename}`;

    req.file.filename = filename;

    res.locals.fileInfo = await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .resize(1440)
        .toFile(path);

    res.locals.fileInfo.path = path.replace(process.env.STATIC_PATH, '');

    next();
});

exports.createFloorData = catchAsync(async (req, res, next) => {
    const {building, floor, _id} = req.body;
    const {fileInfo} = res.locals;

    if (_id) {
        return next();
    }

    const buildingData = await BuildingModel.findById(building);
    const newFloorData = await buildingData.floorsData.create({
        floorNumber: floor,
        floorPlan: fileInfo.path,
        width: fileInfo.width,
        height: fileInfo.height,
    });
    await buildingData.floorsData.push(newFloorData);
    await buildingData.save();

    res.status(201).json({
        data: newFloorData,
    });
});

exports.updateFloorPlan = catchAsync(async (req, res, next) => {
    const {building, _id} = req.body;
    const {fileInfo} = res.locals;

    const buildingData = await BuildingModel.findById(building);
    const floorData = _id ? buildingData.floorsData.id(_id) : null;

    if (!floorData) {
        return next(
            new AppError(
                'Не найдены данные по указанному идентификатору этажа',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
    }

    const oldPlan = floorData.floorPlan;

    floorData.floorPlan = fileInfo.path;
    floorData.width = fileInfo.width;
    floorData.height = fileInfo.height;

    await buildingData.save();

    if (oldPlan) {
        unlinkFile(process.env.STATIC_PATH + oldPlan)
            .then((_) => logger.info('Схема этажа успешно удалены'))
            .catch((err) => logger.error('Ошибка удаления фото схемы', err));
    }

    res.status(200).json({
        data: floorData,
    });
});
