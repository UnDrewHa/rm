const express = require('express');
const UserController = require('../controllers/UserController');

const route = express.Router();

route
  .patch(
    '/change-password',
    UserController.createPasswordCheckMiddleware('_id'),
    UserController.changePassword,
  )
  .patch(
    '/update-me',
    UserController.createPasswordCheckMiddleware('_id'),
    UserController.updateMe,
  )
  .delete(
    '/delete-me',
    UserController.createPasswordCheckMiddleware('_id'),
    UserController.deleteMe,
  );

module.exports = route;
