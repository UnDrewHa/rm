const express = require('express');
const RoomController = require('../controllers/RoomController');
const AuthController = require('../controllers/AuthController');
const UploadController = require('../controllers/UploadController');

const router = express.Router();

router
    .post('/find', RoomController.getAll)
    .get('/favourites', RoomController.getFavourites)
    .get('/:id', RoomController.getDetails);

router
    .route('/')
    .post(AuthController.restrictedTo(['admin']), RoomController.create)
    .patch(AuthController.restrictedTo(['admin']), RoomController.update)
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
