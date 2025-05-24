const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message, html }) => {
    // إنشاء ناقل البريد
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD // استخدم كلمة مرور التطبيق من Gmail
        }
    });

    // إعداد خيارات الرسالة
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email,
        subject: subject,
        html: html
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; 