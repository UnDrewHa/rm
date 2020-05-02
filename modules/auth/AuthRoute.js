const express = require('express');
const AuthController = require('./AuthController');
const UserController = require('../users/UserController');
const {createAndSendToken} = require('../../common/utils/controllersUtils');

const route = express.Router();

route.post('/signup', AuthController.signup, createAndSendToken);
route.post(
    '/login',
    UserController.createPasswordCheckMiddleware('login'),
    AuthController.login,
    createAndSendToken,
);
route.post('/forgot', AuthController.forgot);
route.patch('/reset/:token', AuthController.reset, createAndSendToken);

module.exports = route;
