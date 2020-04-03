const express = require('express');
const UserController = require('../controllers/UserController');

const route = express.Router();

route.route('/').get(UserController.getUsers);
route.patch(
  '/change-password',
  UserController.createPasswordCheckMiddleware('_id'),
  UserController.changePassword,
);
route.patch(
  '/update-me',
  UserController.createPasswordCheckMiddleware('_id'),
  UserController.updateMe,
);
route.delete(
  '/delete-me',
  UserController.createPasswordCheckMiddleware('_id'),
  UserController.deleteMe,
);

module.exports = route;
