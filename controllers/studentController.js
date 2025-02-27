const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' })
        .select('name email enrolledCourses')
        .populate('enrolledCourses', 'name');
    
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});

exports.createStudent = asyncHandler(async (req, res) => {
    const student = await User.create({
        ...req.body,
        role: 'student'
    });

    res.status(201).json({
        success: true,
        data: student,
        message: 'تم إضافة الطالب بنجاح'
    });
});

exports.updateStudent = asyncHandler(async (req, res) => {
    const student = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new AppError('الطالب غير موجود', 404);
    }

    res.status(200).json({
        success: true,
        data: student,
        message: 'تم تحديث بيانات الطالب بنجاح'
    });
});

exports.deleteStudent = asyncHandler(async (req, res) => {
    const student = await User.findById(req.params.id);

    if (!student) {
        throw new AppError('الطالب غير موجود', 404);
    }

    await student.remove();

    res.status(200).json({
        success: true,
        message: 'تم حذف الطالب بنجاح'
    });
});

exports.getStudent = asyncHandler(async (req, res) => {
    const student = await User.findById(req.params.id)
        .select('name email enrolledCourses')
        .populate('enrolledCourses', 'name description');

    if (!student) {
        throw new AppError('الطالب غير موجود', 404);
    }

    res.status(200).json({
        success: true,
        data: student
    });
});


// ... باقي الدوال 