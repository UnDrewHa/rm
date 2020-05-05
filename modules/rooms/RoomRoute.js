const express = require('express');
const RoomController = require('./RoomController');
const AuthController = require('../auth/AuthController');
const UploadController = require('../upload/UploadController');

const router = express.Router();

router
    .post('/find', RoomController.getAll)
    .get('/favourites', RoomController.getFavourites)
    .get('/:id', RoomController.getDetails);

router
    .route('/')
    .post(
        AuthController.restrictedTo(['admin']),
        UploadController.uploadMultiple,
        RoomController.resizeAndSavePhoto,
        RoomController.create,
    )
    .patch(
        AuthController.restrictedTo(['admin']),
        UploadController.uploadMultiple,
        RoomController.resizeAndSavePhoto,
        RoomController.update,
    )
    .delete(AuthController.restrictedTo(['admin']), RoomController.delete);

router.post(
    '/find',
    AuthController.restrictedTo(['admin']),
    RoomController.getAll,
);

router.post(
    '/upload',
    AuthController.restrictedTo(['admin']),
    UploadController.uploadSingle,
    RoomController.resizeAndSavePhoto,
);

module.exports = router;
