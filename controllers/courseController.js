const Course = require('../models/course');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { bufferToFile } = require('../utils/fileUpload');
const fs = require('fs');

// دالة لإنشاء دورة تدريبية
exports.createCourse = asyncHandler(async (req, res) => {
    let imageUrl = 'default-course.png';
    let imagePublicId = null;
  
    if (req.file) {
      try {
        // تحويل Buffer إلى base64
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
        // رفع الملف إلى Cloudinary
        const uploadResult = await uploadToCloudinary(fileStr, req.file.originalname);
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.public_id;

        console.log(imageUrl,imagePublicId);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ message: 'فشل في رفع الصورة إلى Cloudinary' });
      }
    }
  
    // إنشاء الدورة التدريبية
    const {title,description,price,}=req.body;
    const course = await Course.create({
      title,
      description,
      price,
      imageUrl,
    });
  
    res.status(201).json({
      success: true,
      data: course
    });
  });
exports.getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find()
        .populate('instructors', 'name email ')
        .populate('createdBy', 'name');

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

exports.getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate('createdBy', 'name')
        .populate('enrolledStudents', 'name email');

    if (!course) {
        throw new AppError('الكورس غير موجود', 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

exports.updateCourse = asyncHandler(async (req, res) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        throw new AppError('الكورس غير موجود', 404);
    }

    if (req.file) {
        // حذف الصورة القديمة من Cloudinary
        if (course.imagePublicId) {
            await deleteFromCloudinary(course.imagePublicId);
        }

        // رفع الصورة الجديدة
        const tempFile = await bufferToFile(req.file.buffer, req.file.originalname);
        const uploadResult = await uploadToCloudinary(tempFile);
        req.body.image = uploadResult.url;
        req.body.imagePublicId = uploadResult.public_id;
        
        await fs.promises.unlink(tempFile.path);
    }

    course = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: course
    });
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  


    // التحقق من الصلاحيات
    if (req.user.role !== 'manager') {
        throw new AppError('غير مصرح لك بحذف هذا الكورس', 403);
    }
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course.imagePublicId) {
        await deleteFromCloudinary(course.imagePublicId);
    }

    res.status(200).json({
        success: true,
        message: 'تم حذف الكورس بنجاح'
    });
}); 