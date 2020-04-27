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
            type: String,
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
    const {ids, date, from, to} = filter;

    return {
        room: {$in: ids},
        date: date,
        $or: [
            {from: {$gte: from, $lt: to}},
            {from: {$lt: from}, to: {$gt: from}},
        ],
    };
};

module.exports = EventSchema;
