const express = require('express');
const BuildingController = require('../controllers/BuildingController');
const RoomController = require('../controllers/RoomController');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.route('/users').get(UserController.getAll);

router
  .route('/buildings')
  .get(BuildingController.getAll)
  .post(BuildingController.create)
  .patch(BuildingController.update)
  .delete(BuildingController.delete);

router
  .route('/rooms')
  .get(RoomController.getAll)
  .post(RoomController.create)
  .patch(RoomController.update)
  .delete(RoomController.delete);

router.get('/rooms/:id', RoomController.getDetails);

module.exports = router;
