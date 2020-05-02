const express = require('express');
const EventController = require('./EventController');

const router = express.Router();

router
    .post('/', EventController.create)
    .patch('/', EventController.update)
    .delete('/', EventController.cancel)
    .post('/find', EventController.getAll)
    .get('/:id', EventController.getDetails);

module.exports = router;
