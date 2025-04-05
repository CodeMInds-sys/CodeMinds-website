const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const studentController = require('../controllers/studentController');
const userController = require('../controllers/userController');

router.use(auth);

// routes للمدير فقط
router.get('/', checkRole('manager'), studentController.getStudents);
router.post('/', checkRole('manager'), studentController.createStudent);
router.put('/:id', checkRole('manager'), studentController.updateStudent);
router.delete('/:id', checkRole('manager'), studentController.deleteStudent);
router.get('/:id', checkRole('manager'), studentController.getStudent);
// router.get('/enrolled-courses', checkRole('manager'), studentController.getEnrolledCourses);

router.post('/enroll-course', userController.enrollCourse);
module.exports = router; 