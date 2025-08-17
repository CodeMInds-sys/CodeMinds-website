const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const {CourseProgress,lectureProgressSchema} = require('../models/courseProgress');



exports.addLectureProgress = asyncHandler(async (req, res) => {
    const progressId=req.params.id;
    const courseProgress = await CourseProgress.findById(progressId);
    if (!courseProgress) {
        throw new AppError('Course progress not found', 404);
    }

    const {lectureId,attendance,grade,notes,isTaskSubmitted}=req.body;
    const lectureProgress = new lectureProgressSchema({
        student:courseProgress.student,
        lecture:lectureId,
        attendance,
        grade,
        notes,
        isTaskSubmitted
    });
    courseProgress.lectureProgress.push(lectureProgress);
    await courseProgress.save();
    res.status(200).json({
        success: true,
        data: lectureProgress,
        message: 'Lecture progress added successfully'
    });
});


exports.updateLectureProgress = asyncHandler(async (req, res) => {
    const progressId=req.params.id;
    const courseProgress = await CourseProgress.findById(progressId);
    if (!courseProgress) {
        throw new AppError('Course progress not found', 404);
    }

    const {lectureId,attendance,grade,notes,isTaskSubmitted}=req.body;
    const lectureProgress = await lectureProgressSchema.findById(lectureId);
    if (!lectureProgress) {
        throw new AppError('Lecture progress not found', 404);
    }
    lectureProgress.attendance=attendance;
    lectureProgress.grade=grade;
    lectureProgress.notes=notes;
    lectureProgress.isTaskSubmitted=isTaskSubmitted;
    await lectureProgress.save();
    await courseProgress.save()
    res.status(200).json({
        success: true,
        data: lectureProgress,
        message: 'Lecture progress added successfully'
    });
});

