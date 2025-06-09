const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const Group = require('../models/group');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Student = require('../models/student');
const Course = require('../models/course');
const Lecture = require('../models/lecture');
const ReqToEnroll = require('../models/reqToEnroll');

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
    let groups = await Group.find()
        .populate({
            path: 'instructor',
            select: 'name email phone profileRef profileModel'
        })
        .populate({
            path: 'course',
            select: 'title'
        })
        .populate({
            path: 'students',
            select: 'name email phone profileRef profileModel'
        });

    // manual populate لكل student في كل group
    for (const group of groups) {
        for (const student of group.students) {
            if (student?.profileRef && student?.profileModel) {
                await student.populate({
                    path: 'profileRef',
                    model: student.profileModel
                });
            }
        }
    }

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
    const students=group.students;
    for (const student of students) {
        const user=await User.findById(student).populate('profileRef');
        user.profileRef.groups.pull(group._id);
        await user.save();
    }
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
        throw new AppError('Group not found', 404);
    }
    
    res.status(200).json({
        success: true,
        data: group
    });
})







exports.addStudentToGroup = asyncHandler(async (req, res) => {
    const { groupId, studentId,reqToEnrollId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new AppError('group not found', 404);
    }
    const reqToEnroll = await ReqToEnroll.findById(reqToEnrollId);
    if (!reqToEnroll) {
        throw new AppError('request to enroll not found', 404);
    }
    const student = await User.findById(studentId).populate('profileRef');
    if (!student) {
        throw new AppError('student not found', 404);
    } 
    
    // check if student already in group
    if (group.students.includes(studentId)) {
        throw new AppError('student already in this group', 400);
    }
    
    // check if group already in student's groups
    if (student.profileRef.groups.includes(groupId)) {
        throw new AppError('group already assigned to student', 400);
    }
    
    // push student to group
    group.students.push(studentId);
    await group.save();
    
    // push group to student
    student.profileRef.groups.push(groupId);
    await student.profileRef.save();
    
    reqToEnroll.group=groupId;  
    reqToEnroll.joined=true;
    await reqToEnroll.save();
     
    res.status(200).json({
        success: true,
        message: 'student added to group successfully', 
        data: group
    });
     
});

 
exports.getGroupsOfInstructor = asyncHandler(async (req, res) => {
    const instructorId = req.params.id;
    
    const groups = await Group.find({ instructor: instructorId })
        .populate({
            path: 'course',
            select: 'title'
        })
        .populate({
            path: 'students',
            select: 'name'
        })
        .populate({
            path: 'lectures',
            // select: 'title date description' // هات أي بيانات محتاجها من المحاضرة
        });

    res.status(200).json({
        success: true,
        data: groups
    });
});



exports.addLectureToGroup = asyncHandler(async (req, res) => {
    const { groupId, title,description,date,objectives,videos} = req.body;
    const group = await Group.findById(groupId);
    if (!group) {
        throw new AppError('group not found', 404);
    }
    if(group.instructor.toString() !== req.user._id.toString()){
        throw new AppError('you are not authorized to add lecture to this group', 401);
    }
    const lecture = await new Lecture({
        title,
        description,
        objectives,
        date,
        videos,
        group:groupId,
        course:group.course
    });
    await lecture.save();

    group.lectures.push(lecture._id);
    await group.save();
    res.status(200).json({
        success: true,
        message: 'lecture added to group successfully', 
        data: group
    });
});
