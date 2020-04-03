const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

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
