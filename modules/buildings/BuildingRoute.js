const express = require('express');
const BuildingController = require('./BuildingController');
const AuthController = require('../auth/AuthController');
const UploadController = require('../upload/UploadController');

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

router.post(
    '/floor-data',
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    BuildingController.getFloorData,
);

router.post(
    '/upload',
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    UploadController.uploadSingle,
    BuildingController.resizeAndSavePhoto,
    BuildingController.createFloorData,
    BuildingController.updateFloorPlan,
);

router.post(
    '/update-floor',
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    BuildingController.updateFloorData,
);

module.exports = router;
