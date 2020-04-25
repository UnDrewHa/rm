const {isEmpty} = require('lodash');
const EventModel = require('../models/EventModel');
const {catchAsync, getFieldsFromObject} = require('../utils/controllersUtils');
const {AppError} = require('../utils/errorUtils');

/**
 * Контроллер создания документа "Встреча".
 */
exports.create = catchAsync(async function (req, res, next) {
    const newEventData = getFieldsFromObject(req.body.data, [
        'room',
        'date',
        'canceled',
        'from',
        'to',
        'title',
        'description',
        'owner',
        'members',
    ]);
    const reservedEvents = await EventModel.find(
        EventModel.getReservedEventsFilter({
            ids: [newEventData.room],
            date: newEventData.date,
            dateFrom: newEventData.from,
            dateTo: newEventData.to,
        }),
    );

    if (!isEmpty(reservedEvents)) {
        return next(
            new AppError('Переговорка забронирована на выбранное время'),
        );
    }

    const event = await EventModel.create(newEventData);

    res.status(201).send({
        data: event,
    });
});

/**
 * Контроллер получения списка документов "Встреча".
 */
exports.getAll = catchAsync(async function (req, res) {
    const {filter} = req.body.data;
    const events = await EventModel.find(
        getFieldsFromObject(filter, [
            'room',
            'date',
            'owner',
            'canceled',
            'to',
            'from',
        ]),
    );

    res.status(200).send({
        data: events,
    });
});

/**
 * Контроллер получения детальной информации документа "Встреча".
 */
exports.getDetails = catchAsync(async function (req, res, next) {
    const {id} = req.params;

    const event = await EventModel.findById(id);
    if (!event) {
        return next(new AppError('Документ не найден', 404));
    }

    res.status(200).send({
        data: event,
    });
});

/**
 * Контроллер обновление документа "Встреча".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;

    const event = await EventModel.findById(_id);
    if (!event) {
        return next(new AppError('Документ не найден', 404));
    }

    const eventData = getFieldsFromObject(req.body.data, [
        'room',
        'date',
        'canceled',
        'from',
        'to',
        'title',
        'description',
        'owner',
        'members',
    ]);
    const reservedEvents = await EventModel.find({
        _id: {$ne: _id},
        ...EventModel.getReservedEventsFilter({
            ids: [eventData.room],
            date: eventData.date,
            dateFrom: eventData.from,
            dateTo: eventData.to,
        }),
    });

    if (!isEmpty(reservedEvents)) {
        return next(
            new AppError('Переговорка забронирована на выбранное время'),
        );
    }

    await event.update(eventData, {
        runValidators: true,
    });

    res.status(200).send();
});

/**
 * Контроллер удаления документов "Встреча".
 */
exports.delete = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    await EventModel.updateMany(
        {
            _id: {$in: ids},
        },
        {canceled: true},
    );

    res.status(200).send();
});
