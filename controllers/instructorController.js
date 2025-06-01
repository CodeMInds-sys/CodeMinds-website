const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Instructor = require('../models/instructor');
const User = require('../models/user');
const bcrypt = require('bcryptjs');



exports.getInstructors = asyncHandler(async (req, res) => {
    const instructors = await User.find({ role: 'instructor' })
    .populate(
        {
            path: 'profileRef',
            select: 'name email status specialization coursesCanTeach'
        }
    )
    const acceptedInstructors = instructors.filter(instructor => instructor.profileRef.status === 'pending');
    res.status(200).json({
        success: true,
        data: acceptedInstructors
    });
});

exports.createInstructor = asyncHandler(async (req, res) => {
    const {specialization,experienceYears,bio,
          github,linkedin, coursesCanTeach,password } = req.body;
    const instructor = await new Instructor({
        specialization,
        experienceYears,
        bio,
        github,
        linkedin,
        coursesCanTeach,
    });
    const user = req.user;
    user.role='instructor';
    user.profileRef=instructor._id;
    user.profileModel='Instructor';
    await user.save();
    await instructor.save();
    res.status(201).json({
        success: true,
        data: instructor,
        message: 'instructor created successfully'
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