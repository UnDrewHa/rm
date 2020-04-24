const mongoose = require('mongoose');
const {getFieldErrorMessage} = require('../../utils/errorUtils');

const {Schema} = mongoose;

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, getFieldErrorMessage('название')],
        minlength: 5,
    },
    date: {
        type: String,
        required: [true, getFieldErrorMessage('дата')],
    },
    from: {
        type: Date,
        required: [true, getFieldErrorMessage('время начала')],
    },
    to: {
        type: Date,
        required: [true, getFieldErrorMessage('время окончания')],
    },
    room: {
        type: Schema.ObjectId,
        ref: 'Room',
        required: [true, getFieldErrorMessage('переговорная комната')],
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, getFieldErrorMessage('владелец')],
    },
    members: [
        {
            type: Schema.ObjectId,
            ref: 'User',
        },
    ],
    description: String,
    canceled: {
        type: Boolean,
        default: false,
    },
});

EventSchema.pre(/^find/, function () {
    this.sort('from');
});

EventSchema.statics.getReservedEventsFilter = (filter) => {
    const {ids, date, dateFrom, dateTo} = filter;

    return {
        room: {$in: ids},
        date: date,
        $or: [
            {from: {$gte: dateFrom, $lt: dateTo}},
            {from: {$lt: dateFrom}, to: {$gt: dateFrom}},
        ],
    };
};

module.exports = EventSchema;
