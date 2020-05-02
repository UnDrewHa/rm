const BuildingModel = require('./BuildingModel');
const {commonErrors, commonHTTPCodes} = require('../../common/errors');
const {
    catchAsync,
    getFieldsFromObject,
} = require('../../common/utils/controllersUtils');
const {AppError} = require('../../common/errors');

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
