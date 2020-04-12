const BuildingModel = require('../models/BuildingModel');
const {catchAsync, getFieldsFromObject} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Здание".
 */
exports.create = catchAsync(async function (req, res, next) {
  const building = await BuildingModel.create(
    getFieldsFromObject(req.body, ['name', 'address', 'floors']),
  );

  res.status(201).send({
    status: 'success',
    data: {
      building,
    },
  });
});

/**
 * Контроллер получения списка документов "Здание".
 */
exports.getAll = catchAsync(async function (req, res, next) {
  const buildings = await BuildingModel.find({});

  res.status(200).send({
    status: 'success',
    data: {
      buildings,
    },
  });
});

/**
 * Контроллер удаления документов "Здание".
 */
exports.delete = catchAsync(async function (req, res, next) {
  const {ids} = req.body;

  await BuildingModel.deleteMany({
    _id: {$in: ids},
  });

  res.status(200).send({
    status: 'success',
  });
});

/**
 * Контроллер обновление документа "Здание".
 */
exports.update = catchAsync(async function (req, res, next) {
  const {_id} = req.body;

  const building = await BuildingModel.findById(_id);
  if (!building) {
    return next(new AppError('Документ не найден', 404));
  }

  await building.update(
    getFieldsFromObject(req.body, ['address', 'name', 'floors']),
    {
      runValidators: true,
    },
  );

  res.status(200).send({
    status: 'success',
  });
});
