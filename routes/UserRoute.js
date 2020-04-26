const express = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

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
    .patch(
        '/toggle-favourite',
        AuthController.protect,
        UserController.toggleFavourite,
    )
    .delete(
        '/delete-me',
        UserController.createPasswordCheckMiddleware('_id'),
        UserController.deleteMe,
    )
    .get('/info', UserController.getUserInfo);

module.exports = route;
