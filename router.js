const express = require('express');
const AuthController = require('./modules/auth/AuthController');
const AuthRoute = require('./modules/auth/AuthRoute');
const UserRoute = require('./modules/users/UserRoute');
const RoomRoute = require('./modules/rooms/RoomRoute');
const EventRoute = require('./modules/events/EventRoute');
const BuildingRoute = require('./modules/buildings/BuildingRoute');
const PermissionRoute = require('./modules/permissions/PermissionRoute');

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/buildings', BuildingRoute);
router.use('/events', AuthController.protect, EventRoute);
router.use('/permissions', AuthController.protect, PermissionRoute);
router.use('/rooms', AuthController.protect, RoomRoute);
router.use('/users', AuthController.protect, UserRoute);

module.exports = router;
