const express = require('express');
const EventController = require('../controllers/EventController');

const router = express.Router();

router
  .post('/', EventController.create)
  .patch('/', EventController.update)
  .post('/find', EventController.getAll)
  .get('/:id', EventController.getDetails);

module.exports = router;
