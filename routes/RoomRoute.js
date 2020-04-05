const express = require('express');
const RoomController = require('../controllers/RoomController');

const router = express.Router();

router.get('/', RoomController.getAll).get('/:id', RoomController.getDetails);

module.exports = router;
