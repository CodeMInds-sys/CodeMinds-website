const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');
const ReqToEnroll = require('../models/reqToEnroll');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createStudent = asyncHandler(async (req, res) => {
    const {age,gender} = req.body;
    const user = req.user;
    if(!user){
        throw new AppError('user not found', 404);
    }
    const student = await Student.create({
        age,
        gender,
        user:user._id
    });

    user.role='student';
    user.profileRef=student._id;
    user.profileModel='Student';
    await user.save();

    res.status(201).json({
        success: true,
        data: student,
        message: 'تم إضافة الطالب بنجاح'
    });
});


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

    const reqToEnrollExist = await ReqToEnroll.findOne({
        student: user._id,
        course: courseId,
        status: 'pending'
    });
    if (reqToEnrollExist) {
        throw new AppError('request to enroll student in course already exists', 400);
    }
    
    const reqToEnroll = await ReqToEnroll.create({
        student: user._id,
        course: courseId,
        status: 'pending'
    });
    
    
    if(!reqToEnroll ){
        throw new AppError('failed to enroll student in course', 404);
    }
    res.status(200).json({
        success: true,
        message: 'request to enroll student in course created successfully',
        data: reqToEnroll
    });
});


exports.acceptRequestToEnrollInCourse = asyncHandler(async (req, res) => {
    const { requestId } = req.body;

 
    const reqToEnroll = await ReqToEnroll.findOne({
        _id: requestId,
        status: 'pending'
    });
    if (!reqToEnroll) {
        throw new AppError('request to enroll student in course not found', 404);
    }
    console.log("reqToEnroll",reqToEnroll);
    const course = await Course.findById(reqToEnroll.course);
    if (!course) {
        throw new AppError('course not found', 404);
    }
    const student = await User.findById(reqToEnroll.student);
    console.log("student",student);
    if (!student) {
        throw new AppError('student not found', 404);
    }
    // student.courses.push(reqToEnroll.course);
    // await student.save();

 

    // reqToEnroll.status = 'accepted';
    // await reqToEnroll.save();
    res.status(200).json({
        success: true,
        message: 'request to enroll student in course accepted successfully',
        data: reqToEnroll
    });
});


exports.getAllRequestsToEnrollInCourse = asyncHandler(async (req, res) => {
    const reqToEnroll = await ReqToEnroll.find({})
    .populate('student', 'name email')
    .populate('course', 'title');
    if (!reqToEnroll) {
        throw new AppError('requests to enroll student in course not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'requests to enroll student in course found successfully',
        data: reqToEnroll   
    });
});


// ... باقي الدوال 