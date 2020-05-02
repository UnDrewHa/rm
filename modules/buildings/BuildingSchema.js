const mongoose = require('mongoose');
const {getFieldErrorMessage} = require('../../common/errors');

const {Schema} = mongoose;

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
});
