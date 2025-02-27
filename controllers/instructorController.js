const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getInstructors = asyncHandler(async (req, res) => {
    const instructors = await User.find({ role: 'instructor' })
        .select('name email specialization courses');
    
    res.status(200).json({
        success: true,
        count: instructors.length,
        data: instructors
    });
});

exports.createInstructor = asyncHandler(async (req, res) => {
    const instructor = await User.create({
        ...req.body,
        role: 'instructor'
    });

    res.status(201).json({
        success: true,
        data: instructor,
        message: 'تم إضافة المحاضر بنجاح'
    });
});

exports.updateInstructor = asyncHandler(async (req, res) => {
    const instructor = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!instructor) {
        throw new AppError('المحاضر غير موجود', 404);
    }

    res.status(200).json({
        success: true,
        data: instructor,
        message: 'تم تحديث بيانات المحاضر بنجاح'
    });
});

exports.deleteInstructor = asyncHandler(async (req, res) => {
    const instructor = await User.findById(req.params.id);

    if (!instructor) {
        throw new AppError('المحاضر غير موجود', 404);
    }

    await instructor.remove();

    res.status(200).json({
        success: true,
        message: 'تم حذف المحاضر بنجاح'
    });
});

exports.getInstructor = asyncHandler(async (req, res) => {
    const instructor = await User.findById(req.params.id)
        .select('name email specialization courses');

    if (!instructor) {
        throw new AppError('المحاضر غير موجود', 404);
    }

    res.status(200).json({
        success: true,
        data: instructor
    });
}); 