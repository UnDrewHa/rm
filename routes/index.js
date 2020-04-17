const express = require('express');
const AuthController = require('../controllers/AuthController');
const PermissionsController = require('../controllers/PermissionsController');
const AuthRoute = require('./AuthRoute');
const AdminRoute = require('./AdminRoute');
const UserRoute = require('./UserRoute');
const RoomRoute = require('./RoomRoute');
const EventRoute = require('./EventRoute');

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/users', AuthController.protect, UserRoute);
router.use('/rooms', AuthController.protect, RoomRoute);
router.use('/events', AuthController.protect, EventRoute);
router.use(
    '/admin',
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    AdminRoute,
);

router.get('/permissions', AuthController.protect, PermissionsController.get);

module.exports = router;
