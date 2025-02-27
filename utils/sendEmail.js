const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
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
        html: `
            <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2c3e50;">تأكيد البريد الإلكتروني</h2>
                <p style="color: #34495e;">${message}</p>
                <p style="color: #7f8c8d; font-size: 12px;">إذا لم تقم بطلب هذا البريد، يرجى تجاهله.</p>
            </div>
        `
    };

    // إرسال البريد
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; 