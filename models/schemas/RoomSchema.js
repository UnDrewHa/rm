const mongoose = require('mongoose');
const {getFieldErrorMessage} = require('../../utils/errorUtils');

const {Schema} = mongoose;

module.exports = new Schema({
  name: {
    type: String,
    required: [true, getFieldErrorMessage('название')],
    minlength: 3,
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
        //TODO: Добавить валидацию на основе данных здания.
        return field > 0;
      },
      message: 'Введите существующий номер этажа',
    },
  },
  tv: Boolean,
  projector: Boolean,
  whiteboard: Boolean,
  flipchart: Boolean,
  Building: {
    type: Schema.ObjectId,
    ref: 'Building',
    required: [true, getFieldErrorMessage('здание')],
  },
});
