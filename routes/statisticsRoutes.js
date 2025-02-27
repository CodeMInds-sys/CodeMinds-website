const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const statisticsController = require('../controllers/statisticsController');

router.use(auth);

// route للمدير فقط
router.get('/', checkRole('manager'), statisticsController.getStatistics);

module.exports = router; 