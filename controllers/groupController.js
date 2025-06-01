const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Group = require('../models/group');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Course = require('../models/course');

exports.createGroup = asyncHandler(async (req, res) => {
    console.log(req.user);
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


exports.getGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find()
    .populate(
        {
            path: 'instructor',
            select: 'name email'
        }
    )
    .populate(
        {
            path: 'course',
            select: 'title'
        }
    );
    res.status(200).json({
        success: true,
        data: groups
    });
});

// update Group info
exports.updateGroup= asyncHandler( async(req,res)=>{
    const {title,startDate,endDate,totalSeats,instructorId,courseId} = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError("course not found", 404);
    }
    const group = await Group.findByIdAndUpdate(
        req.params.id,
        {title,startDate,endDate,totalSeats,
            instructor:instructorId,
            course:courseId}
        ,{new:true,runValidators:true});
    if (!group) {
        throw new AppError('Group not found', 404);
    }
    await group.save();
    res.status(200).json({
        success: true,
        data: group
    });
})



exports.deleteGroup = asyncHandler(async (req, res) => {
    const group=await Group.findById(req.params.id);
    const courseId=group.course;
    const course=await Course.findById(courseId);
    course.availableGroups.pull(group._id);
    await course.save();
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
        throw new AppError('Group not found', 404);
    }
    
    res.status(200).json({
        success: true,
        data: group
    });
})
