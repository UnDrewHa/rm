const express = require('express');
const RoomController = require('../controllers/RoomController');

const router = express.Router();

router
    .post('/find', RoomController.getAll)
    .get('/favourites', RoomController.getFavourites)
    .get('/:id', RoomController.getDetails);

module.exports = router;
