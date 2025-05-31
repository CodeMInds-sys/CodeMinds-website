const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Group = require('../models/group');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Course = require('../models/course');

exports.createGroup = asyncHandler(async (req, res) => {
    const { title, startDate, endDate, totalSeats, instructorId, courseId, } = req.body;
    const group = await new Group({
        title,
        startDate,
        endDate,
        totalSeats,
        instructor:instructorId,
        course:courseId,
    });
    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError("course not found", 404);
    }
    course.availableGroups.push(group._id);
    await course.save();
    
    await group.save();
    res.status(201).json({
        success: true,
        data: group,
        message: 'group created successfully'
    });
}); 
