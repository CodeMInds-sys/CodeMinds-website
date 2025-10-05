const { Readable } = require('stream');
const { Storage } = require('megajs');
const AppError = require('./AppError');

const waitForReady = (storage) => {
  return new Promise((resolve, reject) => {
    storage.on('ready', () => resolve());
    storage.on('error', (err) => reject(err));
  });
};

const uploadToMega = async (buffer, fileName) => {
  try {
    // إنشاء جلسة MEGA
    const storage = new Storage({
      email: "mohamed12345abdullah@gmail.com",
      password: "abdo.m.s.mega",
    });

    // انتظر لحد ما MEGA يتجهز
    await waitForReady(storage);
    console.log("✅ MEGA is ready");

    // تحويل الـ buffer إلى stream
    const stream = Readable.from(buffer);

    // رفع الملف
    const file = storage.upload(fileName, stream);
    await file.complete; // لازم تستنى رفع الملف كله

    // رابط عام
    const link = await file.link();
    return link;
  } catch (err) {
    console.error("❌ Error uploading to MEGA:", err);
    throw new AppError("حدث خطأ أثناء رفع الملف إلى MEGA", 500);
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
