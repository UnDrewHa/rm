const RoomModel = require('../models/RoomModel');
const {catchAsync, getFieldsFromReqBody} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Здание".
 */
exports.create = catchAsync(async function (req, res, next) {
  const room = await RoomModel.create(
    getFieldsFromReqBody(req.body, [
      'name',
      'description',
      'seats',
      'floor',
      'tv',
      'projector',
      'whiteboard',
      'flipchart',
      'building',
    ]),
  );

  res.status(201).send({
    status: 'success',
    data: {
      room,
    },
  });
});

/**
 * Контроллер получения списка документов "Здание".
 */
exports.getAll = catchAsync(async function (req, res, next) {
  const rooms = await RoomModel.find({});

  res.status(200).send({
    status: 'success',
    data: {
      rooms,
    },
  });
});

/**
 * Контроллер получения детальной информации документа "Здание".
 */
exports.getDetails = catchAsync(async function (req, res, next) {
  const {id} = req.params;

  const room = await RoomModel.findById(id);
  if (!room) {
    return next(new AppError('Документ не найден', 404));
  }

  res.status(200).send({
    status: 'success',
    data: {
      room,
    },
  });
});

/**
 * Контроллер удаления документов "Здание".
 */
exports.delete = catchAsync(async function (req, res, next) {
  const {ids} = req.body;

  await RoomModel.deleteMany({
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

  const room = await RoomModel.findById(_id);
  if (!room) {
    return next(new AppError('Документ не найден', 404));
  }

  await room.update(
    getFieldsFromReqBody(req.body, [
      'name',
      'description',
      'seats',
      'floor',
      'tv',
      'projector',
      'whiteboard',
      'flipchart',
      'building',
    ]),
    {
      runValidators: true,
    },
  );

  res.status(200).send({
    status: 'success',
  });
});
