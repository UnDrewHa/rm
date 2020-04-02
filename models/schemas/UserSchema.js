const mongoose = require('mongoose');
const validator = require('validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getFieldErrorMessage} = require('../../utils/errorUtils');

const {Schema} = mongoose;

const UserSchema = new Schema({
  login: {
    type: String,
    required: [true, getFieldErrorMessage('логин')],
    unique: true,
    minlength: 2,
    maxlength: 20,
  },
  password: {
    type: String,
    required: [true, getFieldErrorMessage('пароль')],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcript.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

UserSchema.methods.checkPassword = function (enteredPassword, userPassword) {
  return bcript.compare(enteredPassword, userPassword);
};

UserSchema.methods.getToken = function (user) {
  return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

UserSchema.methods.passwordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt && jwtTimestamp) {
    const passwordTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return jwtTimestamp < passwordTimestamp;
  }

  return false;
};

module.exports = UserSchema;
