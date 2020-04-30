const express = require('express');
const RoomController = require('../controllers/RoomController');
const UserController = require('../controllers/UserController');
const EventController = require('../controllers/EventController');

const router = express.Router();

router
    .route('/users')
    .get(UserController.getAll)
    .post(UserController.create)
    .patch(UserController.update)
    .delete(UserController.delete);

router
    .route('/events')
    .post(EventController.create)
    .patch(EventController.update)
    .delete(EventController.delete);

router
    .get('/events/:id', EventController.getDetails)
    .post('/events/find', EventController.getAll);

router
    .route('/rooms')
    .post(RoomController.create)
    .patch(RoomController.update)
    .delete(RoomController.delete);

router.post('/rooms/find', RoomController.getAll);
router.get('/rooms/:id', RoomController.getDetails);

module.exports = router;
