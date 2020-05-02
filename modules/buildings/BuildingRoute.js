const express = require('express');
const BuildingController = require('./BuildingController');
const AuthController = require('../auth/AuthController');

const router = express.Router();

router
    .route('/')
    .get(BuildingController.getAll)
    .post(
        AuthController.protect,
        AuthController.restrictedTo(['admin']),
        BuildingController.create,
    )
    .patch(
        AuthController.protect,
        AuthController.restrictedTo(['admin']),
        BuildingController.update,
    )
    .delete(
        AuthController.protect,
        AuthController.restrictedTo(['admin']),
        BuildingController.delete,
    );

router.get(
    '/:id',
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    BuildingController.getDetails,
);

module.exports = router;
