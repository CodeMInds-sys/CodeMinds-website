const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { generateToken, verifyToken } = require('../middlewares/jwt');
const path = require('path');
const fs = require('fs').promises;
const Logger = require('../utils/logger');



const sendVerificationEmail = async (email, name, verificationUrl) => {
    try {
        let emailTemplate = await fs.readFile(
            path.join(__dirname, '../public/email/verification.html'),
            'utf8'
    );
    
    emailTemplate = emailTemplate
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{verificationUrl\}\}/g, verificationUrl)
        .replace(/\{\{logoUrl\}\}/g, `${process.env.BASE_URL}/images/logo.png`)
        .replace(/\{\{year\}\}/g, new Date().getFullYear().toString());

    await sendEmail({
        email,
        subject: 'Verify your email address',
        html: emailTemplate
    }); 
    return true;
    } catch (error) {
        Logger.error('Error sending verification email', error);
        return new AppError('Failed to send verification email. Please try again', 500);
    }
};  

const authController = {
    // تسجيل مستخدم جديد
    register: asyncHandler(async (req, res) => {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isEmailVerified) {
            throw new AppError('user already exists  ', 400);
        }
        // إنشاء المستخدم الجديد
        const verificationToken =await generateToken({ email }  , '30m');
        const user = await User.create({ 
            email, 
            password, 
            name,
            verificationToken
        });
        
        const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
        
       
        const emailSent = await sendVerificationEmail(email, name, verificationUrl);
        if (emailSent instanceof AppError) {
            throw emailSent;
        }

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح. يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني'
        });

    }),

    // تسجيل الدخول
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;  

        const user = await User.findOne({ email });
        if (!user ) {
            throw new AppError('user not found', 401);
        }
        if (!(await user.comparePassword(password)) ) {
            throw new AppError('wrong password', 401);
        }
        console.log(user);
        if (!user.isEmailVerified) {

            const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${user.verificationToken}`;
            const emailSent = await sendVerificationEmail(user.email, user.name, verificationUrl);
            if (emailSent instanceof AppError) {
                throw emailSent;
            }
            throw new AppError('يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني', 403);
        }

        // إنشاء توكن جديد وتحديث التوكن القديم
        const authToken = generateToken({ id: user._id });
        user.authToken = authToken;
        await user.save();
        console.log("done");
        res.status(200).json({
            success: true,
            token: authToken,
            user,
            message: 'تم تسجيل الدخول بنجاح'
        });
    }),

    // تفعيل الحساب
    verifyEmail: asyncHandler(async (req, res) => {
        const { token } = req.params;

        try {
            // التحقق من التوكن
            const decoded = verifyToken(token);
            const user = await User.findOne({ email: decoded.email });

            if (!user) {
                // قراءة صفحة الخطأ
                const errorHtml = await fs.readFile(
                    path.join(__dirname, '../public/email/responses/error.html'),
                    'utf8'
                );
                
                // إرسال صفحة الخطأ مع رسالة مخصصة
                return res.send(
                    errorHtml.replace('{{errorMessage}}', 'رابط التفعيل غير صالح')
                );
            }

            // تحديث حالة التحقق للمستخدم
            user.isEmailVerified = true;
            await user.save();

            // قراءة صفحة النجاح
            const successHtml = await fs.readFile(
                path.join(__dirname, '../public/email/responses/success.html'),
                'utf8'
            );
            
            // إرسال صفحة النجاح
            res.send(successHtml);

        } catch (error) {
            // في حالة وجود خطأ في التوكن
            const errorHtml = await fs.readFile(
                path.join(__dirname, '../public/email/responses/error.html'),
                'utf8'
            );
            
            // إرسال صفحة الخطأ مع رسالة الخطأ
            res.send(
                errorHtml.replace('{{errorMessage}}', 'رابط التفعيل منتهي الصلاحية أو غير صالح')
            );
        }
    })
};

module.exports = authController; 