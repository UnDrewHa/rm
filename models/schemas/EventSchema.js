const mongoose = require('mongoose');
const {getFieldErrorMessage} = require('../../utils/errorUtils');

const {Schema} = mongoose;

module.exports = new Schema({
  title: {
    type: String,
    required: [true, getFieldErrorMessage('название')],
    minlength: 5,
  },
  dateTime: {
    type: Date,
    required: [true, getFieldErrorMessage('дата')],
  },
  duration: {
    type: Number,
    required: [true, getFieldErrorMessage('продолжительность')],
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
});
