const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const Logger = require('../utils/logger');
const User = require('../models/user');

const generateToken = (payload,time) => {
    const options={};
    if(typeof time === 'string' && time.trim() !== ''){
        options.expiresIn = time;
    }
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        options
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('انتهت صلاحية الرمز', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('رمز غير صالح', 401);
        }
        throw new AppError('خطأ في التحقق من الرمز', 401);
    }
};

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new AppError('يرجى تسجيل الدخول', 401);
        }

        const decoded = verifyToken(token);
        const user = await User.findOne({ 
            _id: decoded.id,
            authToken: token
        });

        if (!user) {
            throw new AppError('تم تسجيل الدخول من جهاز آخر', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateToken,
    verifyToken,
    auth
}; 