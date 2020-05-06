const mongoose = require('mongoose');
const {getFieldErrorMessage} = require('../../common/errors');
const {Schema} = mongoose;

const RoomsDataSchema = new Schema({
    room: {
        type: Schema.ObjectId,
        ref: 'Room',
        required: [true, getFieldErrorMessage('переговорная комната')],
    },
    coords: [
        {
            type: Object,
            required: [true, getFieldErrorMessage('координаты')],
        },
    ],
});

const FloorDataSchema = new Schema({
    floorNumber: {
        type: Number,
        required: [true, getFieldErrorMessage('номер этажа')],
    },
    floorPlan: {
        type: String,
        required: [true, getFieldErrorMessage('план этажа')],
    },
    width: {
        type: Number,
        required: [true, getFieldErrorMessage('ширина плана')],
    },
    height: {
        type: Number,
        required: [true, getFieldErrorMessage('высота плана')],
    },
    roomsData: [RoomsDataSchema],
});

module.exports = new Schema({
    name: String,
    address: {
        type: String,
        required: [true, getFieldErrorMessage('адрес')],
        minlength: 10,
    },
    floors: {
        type: Number,
        default: 1,
    },
    floorsData: {
        type: [FloorDataSchema],
        default: [],
    },
});
