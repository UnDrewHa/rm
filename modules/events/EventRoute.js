const express = require('express');
const EventController = require('./EventController');
const AuthController = require('../auth/AuthController');

const router = express.Router();

router
    .post('/', EventController.create)
    .patch('/', EventController.update)
    .delete('/', EventController.cancel)
    .post('/find', EventController.getAll)
    .get('/:id', EventController.getDetails)
    .post(
        '/approving',
        AuthController.restrictedTo(['admin']),
        EventController.getForApproving,
    )
    .post(
        '/approve',
        AuthController.restrictedTo(['admin']),
        EventController.approve,
    )
    .post(
        '/refuse',
        AuthController.restrictedTo(['admin']),
        EventController.refuse,
    );

module.exports = router;
