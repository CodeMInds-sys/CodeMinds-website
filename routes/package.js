const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');

router
    .route('/')
    .get(packageController.getPackages)
    .post(auth, checkRole('manager', 'admin'), packageController.createPackage);

router
    .route('/:id')
    .get(packageController.getPackage)
    .put(auth, checkRole('manager', 'admin'), packageController.updatePackage)
    .delete(auth, checkRole('manager', 'admin'), packageController.deletePackage);

module.exports = router;