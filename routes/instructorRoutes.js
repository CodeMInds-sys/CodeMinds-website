const express = require('express');
const router = express.Router();
const instructorController  = require('../controllers/instructorController');
const { upload } = require('../utils/fileUpload');
const { auth } = require('../middlewares/jwt');

router.route('/')
    .post(auth, instructorController.createInstructor)
    .get(instructorController.getInstructors);   

router.route('/:id')
    .get(instructorController.getInstructor)
    .put(auth, instructorController.updateInstructor)
    .delete(auth, instructorController.deleteInstructor);

module.exports = router;




