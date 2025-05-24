
const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');
router.post('/view', controller.viewUser);
router.get('/views', controller.getViews);


module.exports = router;
