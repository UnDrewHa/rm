const lodash = require('lodash');
const RoomModel = require('../models/RoomModel');
const EventModel = require('../models/EventModel');
const {catchAsync, getFieldsFromReqBody} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Переговорная комната".
 */
exports.create = catchAsync(async function (req, res) {
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
 * Контроллер получения списка документов "Переговорная комната".
 */
exports.getAll = catchAsync(async function (req, res) {
  const {building, floors, date, dateFrom, dateTo} = req.body;
  const rooms = await RoomModel.find({building, floor: {$in: floors}});
  const ids = rooms.map((item) => item._id);

  if (ids.length === 0) {
    return res.status(200).send({
      status: 'success',
      data: {
        rooms: [],
      },
    });
  }

  const events = await EventModel.find({
    room: {$in: ids},
    date: date,
    $or: [
      {
        $and: [{from: {$gte: dateFrom}}, {from: {$lt: dateTo}}],
      },
      {from: {$lt: dateFrom}, to: {$gt: dateFrom}},
    ],
  });

  const notReservedRooms = rooms.filter(
    (item) =>
      !events.find((event) => {
        return event.room.toString() === item._id.toString();
      }),
  );

  res.status(200).send({
    status: 'success',
    data: {
      rooms: notReservedRooms,
    },
  });
});

/**
 * Контроллер получения детальной информации документа "Переговорная комната".
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
 * Контроллер удаления документов "Переговорная комната".
 */
exports.delete = catchAsync(async function (req, res) {
  const {ids} = req.body;

  await RoomModel.deleteMany({
    _id: {$in: ids},
  });

  res.status(200).send({
    status: 'success',
  });
});

/**
 * Контроллер обновление документа "Переговорная комната".
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
