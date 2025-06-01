const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');
const ReqToEntoll = require('../models/reqToEntoll');
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

exports.enrollStudentInCourse = asyncHandler(async (req, res) => {
    const {courseId } = req.body; 

    const user=req.user;
    if(!user){
        throw new AppError('user not found', 404);
    }
    if(user.role!=='student'){
        throw new AppError('user is not a student', 404);
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError('course not found', 404);
    }
    
    const reqToEntoll = await ReqToEntoll.create({
        student: user._id,
        course: courseId,
        status: 'pending'
    });
    
    if(!reqToEntoll){
        throw new AppError('failed to enroll student in course', 404);
    }
    res.status(200).json({
        success: true,
        message: 'request to enroll student in course created successfully',
        data: reqToEntoll
    });
});


exports.acceptRequestToEnrollInCourse = asyncHandler(async (req, res) => {
    const { reqToEntollId } = req.body;

 
    const reqToEntoll = await ReqToEntoll.findOne({
        _id: reqToEntollId,
        status: 'pending'
    });
    if (!reqToEntoll) {
        throw new AppError('request to enroll student in course not found', 404);
    }

    const course = await Course.findById(reqToEntoll.course);
    if (!course) {
        throw new AppError('course not found', 404);
    }
    const student = await User.findById(reqToEntoll.student);
    if (!student) {
        throw new AppError('student not found', 404);
    }
    student.enrolledCourses.push(reqToEntoll.course);
    await student.save();

    course.enrolledStudents.push(student._id);
    await course.save();

    reqToEntoll.status = 'accepted';
    await reqToEntoll.save();
    res.status(200).json({
        success: true,
        message: 'request to enroll student in course accepted successfully',
        data: reqToEntoll
    });
});



// ... باقي الدوال 