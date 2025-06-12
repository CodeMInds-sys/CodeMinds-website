const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email/:token', authController.verifyEmail);

// مثال على route محمي
router.get('/profile', auth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

router.get('/verifyToken', auth, authController.verifyToken);


router.post('/requestChangePassword', authController.requestChangePassword);

router.get('/verifyChangePassword', authController.verifyChangePassword);

router.post('/changePassword', authController.changePassword);

module.exports = router; 