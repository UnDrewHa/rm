const mongoose = require('mongoose');
const validator = require('validator');
const {getFieldErrorMessage} = require('../../utils/errorUtils');

const {Schema} = mongoose;

module.exports = new Schema({
  login: {
    type: String,
    required: [true, getFieldErrorMessage('логин')],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: [true, getFieldErrorMessage('пароль')],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, getFieldErrorMessage('повторный пароль')],
    validate: {
      validator: function (field) {
        return field === this.password;
      },
      message: 'Введенные пароли не совпадают',
    },
  },
  email: {
    type: String,
    required: [true, getFieldErrorMessage('e-mail')],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Введите корректный адрес электронной почты'],
  },
  phone: {
    type: String,
    validate: {
      validator: function (field) {
        return validator.isMobilePhone(
          field,
          validator.isMobilePhoneLocales['ru-RU'],
        );
      },
      message: 'Введите корректный номер телефона',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  building: {
    type: Schema.ObjectId,
    ref: 'Building',
    required: [true, getFieldErrorMessage('здание')],
  },
  favouriteRooms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
    },
  ],
  photo: String,
  name: String,
  surname: String,
  patronymic: String,
});
