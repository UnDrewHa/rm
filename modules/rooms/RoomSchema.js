const {isEmpty} = require('lodash');
const mongoose = require('mongoose');
const {getFieldsFromObject} = require('../../common/utils/controllersUtils');
const {getFieldErrorMessage} = require('../../common/errors');

const {Schema} = mongoose;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: [true, getFieldErrorMessage('название')],
        minlength: 3,
        maxLength: 25,
    },
    description: String,
    photos: [String],
    seats: {
        type: Number,
        required: [true, getFieldErrorMessage('количество сидячих мест')],
    },
    floor: {
        type: Number,
        required: [true, getFieldErrorMessage('этаж')],
        validate: {
            validator: function (field) {
                return field > 0;
            },
            message: 'Введите существующий номер этажа',
        },
    },
    tv: Boolean,
    projector: Boolean,
    whiteboard: Boolean,
    flipchart: Boolean,
    building: {
        type: Schema.ObjectId,
        ref: 'Building',
        required: [true, getFieldErrorMessage('здание')],
    },
    needApprove: {
        type: Boolean,
        default: false,
    },
});

RoomSchema.statics.getRoomsFilter = (filter) => {
    let result = {
        ...getFieldsFromObject(filter, [
            'tv',
            'projector',
            'whiteboard',
            'flipchart',
            'needApprove',
            'building',
        ]),
        seats: {$gte: filter.seats || 1},
    };

    if (!isEmpty(filter.floors)) {
        result.floor = {$in: filter.floors};
    }

    return result;
};

RoomSchema.statics.getNotReservedRooms = (rooms, events) => {
    return rooms.filter(
        (room) =>
            !events.find((event) => {
                return event.room.toString() === room._id.toString();
            }),
    );
};

module.exports = RoomSchema;
