const express = require('express');
const AuthController = require('./AuthController');
const UserController = require('../users/UserController');

const route = express.Router();

route.post('/signup', AuthController.signup);
route.post(
    '/login',
    UserController.createPasswordCheckMiddleware('login'),
    AuthController.login,
);
route.post('/forgot', AuthController.forgot);
route.patch('/reset/:token', AuthController.reset);

module.exports = route;
