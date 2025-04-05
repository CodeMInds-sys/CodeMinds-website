const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const auth = require("../middlewares/jwt");


const enrollCourse = asyncHandler(async (req, res) => {
    const user= req.user;
    const {  courseId } = req.body;
    

    
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new AppError('الكورس غير موجود', 404));
    }
    
    user.enrolledCourses.push(courseId);
    user.role='student';
    await user.save();
    
    res.status(200).json({
        success: true,
        message: 'تم إضافة الكورس الى المستخدم بنجاح'
    });
});



module.exports = {
    enrollCourse
}
