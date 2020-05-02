const {isEmpty} = require('lodash');
const EventModel = require('./EventModel');
const {commonErrors, commonHTTPCodes} = require('../../common/errors');
const {
    catchAsync,
    getFieldsFromObject,
} = require('../../common/utils/controllersUtils');
const {AppError} = require('../../common/errors');

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
            from: newEventData.from,
            to: newEventData.to,
        }),
    );

    if (!isEmpty(reservedEvents)) {
        return next(
            new AppError(
                'Переговорка забронирована на выбранное время',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
    }

    const event = await EventModel.create(newEventData);
    await EventModel.populate(event, {path: 'owner'});

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

    if (filter.populateOwner) {
        await EventModel.populate(events, {path: 'owner'});
    }

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
        return next(
            new AppError(commonErrors.NOT_FOUND, commonHTTPCodes.NOT_FOUND),
        );
    }

    await EventModel.populate(event, [{path: 'owner'}, {path: 'room'}]);

    res.status(200).send({
        data: event,
    });
});

/**
 * Контроллер обновление документа "Встреча".
 */
exports.update = catchAsync(async function (req, res, next) {
    const {_id} = req.body.data;

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
            from: eventData.from,
            to: eventData.to,
        }),
    });

    if (!isEmpty(reservedEvents)) {
        return next(
            new AppError(
                'Переговорка забронирована на выбранное время',
                commonHTTPCodes.BAD_REQUEST,
            ),
        );
    }

    const updated = await EventModel.findOneAndUpdate({_id}, eventData, {
        new: true,
    });

    res.status(200).send({
        data: updated,
    });
});

/**
 * Контроллер удаления документов "Встреча".
 */
exports.cancel = catchAsync(async function (req, res) {
    const {ids} = req.body.data;

    await EventModel.updateMany(
        {
            _id: {$in: ids},
        },
        {canceled: true},
    );

    res.status(200).send({
        data: ids,
    });
});
