const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const instructorController = require('../controllers/instructorController');

router.use(auth);

// routes للمدير فقط
router.get('/', checkRole('manager'), instructorController.getInstructors);
router.post('/', checkRole('manager'), instructorController.createInstructor);
router.put('/:id', checkRole('manager'), instructorController.updateInstructor);
router.delete('/:id', checkRole('manager'), instructorController.deleteInstructor);
router.get('/:id', checkRole('manager'), instructorController.getInstructor);

module.exports = router; 