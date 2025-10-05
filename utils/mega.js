const { Storage } = require("megajs");
const { Readable } = require("stream");
const AppError = require("./AppError");

let storage;

const initMega = () => {
  if (storage) return Promise.resolve(storage);

  return new Promise((resolve, reject) => {
    storage = new Storage({
      email: "mohamed12345abdullah@gmail.com",
      password: "abdo.m.s.mega",
    });

    storage.on("ready", () => {
      console.log("✅ MEGA storage is ready");
      resolve(storage);
    });

    storage.on("error", (err) => {
      console.error("❌ Error connecting to MEGA:", err);
      reject(err);
    });
  });
};

const uploadToMega = async (buffer, fileName, fileSize) => {
  try {
    const storage = await initMega();

    const stream = Readable.from(buffer);

    // هنا بنحدد الحجم عشان نتفادى مشكلة allowUploadBuffering
    const uploadStream = storage.upload({
      name: fileName,
      size: fileSize,
    }, stream);

    // نستنى لحد ما الرفع يكمل
    const file = await uploadStream.complete;

    // دلوقتي تقدر تجيب الرابط
    const link = await file.link();

    return link;
  } catch (err) {
    console.error("❌ Error uploading to MEGA:", err);
    throw new AppError("حدث خطأ أثناء رفع الملف إلى MEGA", 500);
  }
};
const megaMiddleware = async (req, res, next) => {
    try {
      if (!req.file) {
        return next(new AppError("يجب رفع ملف واحد على الأقل", 400));
      }
  
      const { buffer, originalname, size } = req.file;
  
      const link = await uploadToMega(buffer, originalname, size);
  
      req.megaLink = link;
      next();
    } catch (err) {
      next(err);
    }
  };

  module.exports = megaMiddleware;