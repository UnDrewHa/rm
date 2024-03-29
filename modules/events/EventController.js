const {isEmpty} = require('lodash');
const moment = require('moment');
const EventModel = require('./EventModel');
const RoomModel = require('../rooms/RoomModel');
const {sendSingleEventRefuse} = require('../../core/emails/EmailTransport');
const {approveStatuses} = require('./consts');
const {sendEventMail} = require('../../core/emails/EmailTransport');
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

    const room = await RoomModel.findById(newEventData.room);

    if (room.needApprove) {
        newEventData.approveStatus = approveStatuses.NEED_APPROVE;
    }

    const event = await EventModel.create(newEventData);
    await EventModel.populate(event, ['owner', 'room']);

    sendEventMail(event);

    res.status(201).send({
        data: event,
    });
});

/**
 * Контроллер получения списка документов "Встреча".
 */
exports.getAll = catchAsync(async function (req, res) {
    const {filter} = req.body.data;
    let filterData = getFieldsFromObject(filter, [
        'room',
        'date',
        'owner',
        'canceled',
        'to',
        'from',
    ]);

    if (filter.tab === 'ACTIVE') {
        filterData.to = {$gt: filter.now};
        filterData.canceled = {$ne: true};
    }

    if (filter.tab === 'COMPLETED') {
        filterData.to = {$lte: filter.now};
        filterData.canceled = {$ne: true};
    }

    if (filter.tab === 'CANCELED') {
        filterData.canceled = true;
    }

    const events = await EventModel.find(filterData);

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

    await EventModel.populate(event, ['owner', 'room']);

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

/**
 * Контроллер получения списка документов "Встреча".
 */
exports.getForApproving = catchAsync(async function (req, res) {
    const {filter} = req.body.data;
    let events = [];

    const roomsForApproving = await RoomModel.find({
        building: filter.building,
        needApprove: true,
    });

    if (roomsForApproving.length > 0) {
        events = await EventModel.find({
            room: {$in: roomsForApproving.map((item) => item._id)},
            date: filter.date,
            to: {$gt: moment().utc().format()},
            canceled: {$ne: true},
            approveStatus: approveStatuses.NEED_APPROVE,
        }).populate(['owner', 'room']);
    }

    res.status(200).send({
        data: events,
    });
});

exports.approve = catchAsync(async function (req, res) {
    const {ids} = req.body.data;
    const events = await EventModel.find({_id: {$in: ids}});

    await EventModel.updateMany(
        {
            _id: {$in: ids},
        },
        {
            approveStatus: approveStatuses.APPROVED,
        },
    );

    res.status(200).send({
        data: events.map((item) => item._id),
    });
});

exports.refuse = catchAsync(async function (req, res) {
    const {ids} = req.body.data;
    const events = await EventModel.find({_id: {$in: ids}});
    await EventModel.populate(events, ['owner']);

    await EventModel.updateMany(
        {
            _id: {$in: ids},
        },
        {
            approveStatus: approveStatuses.REFUSED,
            canceled: true,
        },
    );

    events.forEach((item) => {
        sendSingleEventRefuse({
            eventId: item._id,
            eventName: item.title,
            owner: item.owner.email,
        });
    });

    res.status(200).send({
        data: events.map((item) => item._id),
    });
});
