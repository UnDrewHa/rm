const express = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const UploadController = require('../controllers/UploadController');

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
    .patch('/toggle-favourite', UserController.toggleFavourite)
    .delete(
        '/delete-me',
        UserController.createPasswordCheckMiddleware('_id'),
        UserController.deleteMe,
    )
    .get('/info', UserController.getUserInfo)
    .post(
        '/upload',
        UploadController.uploadSingle,
        UserController.resizeAndSavePhoto,
    );

route
    .route('/')
    .post(AuthController.restrictedTo(['admin']), UserController.create)
    .patch(AuthController.restrictedTo(['admin']), UserController.update)
    .delete(AuthController.restrictedTo(['admin']), UserController.delete);

route.get(
    '/:id',
    AuthController.restrictedTo(['admin']),
    UserController.getById,
);
route.post(
    '/find',
    AuthController.restrictedTo(['admin']),
    UserController.find,
);

module.exports = route;
