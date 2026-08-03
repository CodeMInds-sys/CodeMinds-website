const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const purchaseController = require('../controllers/purchaseController');
const { upload } = require('../utils/fileUpload');

const uploadImage = upload(['image/jpeg', 'image/png', 'image/jpg']);
// router.use(auth); // حماية جميع routes الكورسات

// routes للمدير والمحاضر
router.post('/uploadPaymentProof/admin', 
    // auth,
    // checkRole('manager', 'instructor'), 
    uploadImage.single('proofImage'), // middleware لرفع الصورة
    purchaseController.uploadPaymentProofByAdmin
);

// router.put('/:id', 
//     // checkRole('manager', 'instructor'), 
//     uploadImage.single('image'), // middleware لرفع الصورة
//     courseController.updateCourse
// );

// // routes للمدير فقط
// router.delete('/:id', 
//     // checkRole('manager'), 
//     courseController.deleteCourse);

// // routes عامة (مع التحقق من تسجيل الدخول)
router.get('/', purchaseController.getAllPurchases);
// router.get('/:id', courseController.getCourse);

module.exports = router; 