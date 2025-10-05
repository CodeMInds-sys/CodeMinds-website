// mega.js
const { mega } = require('megajs');
const AppError = require('./AppError');
const { Readable } = require('stream');
const {Storage} = require('megajs');

const uploadToMega = async (buffer, fileName) => {
  try {
    // الاتصال بحساب MEGA
    const storage = new Storage({
      email:"mohamed12345abdullah@gmail.com",
      password:"abdo.m.s.mega",
    })
    storage.on('ready', () => {
      console.log('✅ MEGA is ready');
    })
    storage.on('error', (err) => {
      console.error('❌ Error connecting to MEGA:', err);
    })
    storage.on('close', () => {
      console.log('✅ MEGA connection closed');
    })

    // تحويل الـ buffer إلى stream
    const stream = Readable.from(buffer);

    // رفع الملف من stream مباشرة
    const file = await storage.upload(fileName, stream).complete;

    // الحصول على الرابط العام
    const link = await file.link();

    return link;
  } catch (err) {
    console.error('❌ Error uploading to MEGA:', err);
    throw new AppError('حدث خطأ أثناء رفع الملف إلى MEGA', 500);
  }
};

// Middleware خاص بـ MEGA بعد multer
const megaMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('يجب رفع ملف واحد على الأقل', 400));
    }

    const { buffer, originalname } = req.file;

    // رفع الملف مباشرة من الـ buffer
    const link = await uploadToMega(buffer, originalname);

    // حفظ رابط MEGA داخل req لاستخدامه بعد كده
    req.megaLink = link;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = megaMiddleware;
