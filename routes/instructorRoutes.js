const express = require('express');
const router = express.Router();
const instructorController  = require('../controllers/instructorController');
const { upload } = require('../utils/fileUpload');
const { auth } = require('../middlewares/jwt');
const uploadFileToGoogleDrive = require('../utils/googleDrive');
const megaMiddleware = require('../utils/mega');
const uploadFile = upload(['application/pdf','image/jpeg', 'image/png', 'image/jpg']);
const checkRole = require('../middlewares/checkRole');
const Logger = require('../utils/logger');

router.route('/:status')
    .get(instructorController.getInstructors);    

router.route('/instructor/:id')
    .post(auth, uploadFile.single('cv'), instructorController.createInstructor)
    .get(instructorController.getInstructor)
    .put(auth, instructorController.updateInstructor)
    .delete(auth, instructorController.deleteInstructor)
    .patch( instructorController.acceptORrejectInstructor);
//auth,checkRole(['manager']),
module.exports = router;




