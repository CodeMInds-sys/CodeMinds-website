

const express = require('express');
const router = express.Router();
const maleController = require('../controllers/maleController');

router.post('/addMaleForm', maleController.addMaleForm);

module.exports = router;