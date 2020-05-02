const express = require('express');
const PermissionsController = require('./PermissionsController');

const router = express.Router();

router.route('/').get(PermissionsController.get);

module.exports = router;
