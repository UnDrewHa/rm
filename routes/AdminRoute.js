const express = require('express');
const RoomController = require('../controllers/RoomController');
const EventController = require('../controllers/EventController');

const router = express.Router();

router
    .route('/events')
    .post(EventController.create)
    .patch(EventController.update)
    .delete(EventController.delete);

router
    .get('/events/:id', EventController.getDetails)
    .post('/events/find', EventController.getAll);

module.exports = router;
