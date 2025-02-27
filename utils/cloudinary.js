const cloudinary = require('cloudinary').v2;

// تكوين Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// دالة لرفع الملف إلى Cloudinary
const uploadToCloudinary = async (fileStr, originalname) => {
    try {
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: 'codeminds', // اسم المجلد في Cloudinary
        use_filename: true,
        unique_filename: true,
      });
  
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('فشل في رفع الملف إلى Cloudinary');
    }
  };
// دالة لحذف الملف
const deleteFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('فشل في حذف الملف');
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
}; 