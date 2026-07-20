const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const auth = require("../middlewares/jwt");
const Guest = require("../models/guest");
const  sendEmail  = require("../utils/sendEmail");
const Student = require("../models/student");
const {courseProgress} = require("../models/courseProgress");
const Instructor = require("../models/instructor");
const Group=require("../models/group");


const viewUser = asyncHandler(async (req, res) => {
    const {ip,page}= req.body;

    const guest = await Guest.findOne({ip})
    if (!guest) {
        const newGuest = await Guest.create({ip,views:[{page,count:1}]})
        return res.status(200).json({
            success: true,
            message: 'تم إضافة المستخدم بنجاح'
        });
    }
    
    const view = guest.views.find((view) => view.page === page);
    if (view) {
        view.count++;
    } else {
        guest.views.push({ page, count: 1 });
    }
    await guest.save();
    res.status(200).json({
        success: true,
        message: 'تم تحديث بيانات المستخدم بنجاح'
    });
});


const getViews = asyncHandler(async (req, res) => {
    // get the sum of views for all pages
    const allViews = await Guest.aggregate([
        {
            $unwind: "$views"
        },
        {
            $group: {
                _id: "$views.page",
                count: { $sum: "$views.count" }
            }
        }
    ]);
    const views = allViews.map((view) => ({
        page: view._id,
        count: view.count
    }));
    console.log(views); 
   
    const gests = await Guest.find({});
    console.log(gests.length);


    res.status(200).json({
        success: true,
        views,
        noOfGuests:gests.length,
        guests:gests
    });
});


const showAllUsers = asyncHandler(async (req, res) => {
    const { role } = req.params;
    let users;
    if(role=='all'){
        users = await User.find({})
    }else{
        users = await User.find({role}).populate('profileRef')
    }
    // .populate('profi')
    res.status(200).json({
        success: true,
        users
    });
});

// const uploadFileToGoogleDrive = asyncHandler(async (req, res) => {
//     const { file } = req;
//     const {fileId,fileUrl}=req;
//     const {name}=req.body;
//     if (!file) {
//         return res.status(400).json({
//             success: false,
//             message: 'No file uploaded'
//         });
//     }
//     res.status(200).json({
//         success: true,
//         fileUrl,
//         fileId,
//         name
//     });
// });



const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    if(user.role === 'user'){
        // delete the user
        await User.findByIdAndDelete(id);
    }else if(user.role === 'student'){
        // delete the student's profile
        let student = await Student.findById(user.profileRef);
        if(student && student.courseProgress.length > 0){
            // delete the student's course progress
 
            for(let i=0;i<student.courseProgress.length;i++){
                console.log(student.courseProgress[i]);
                
                await courseProgress.findByIdAndDelete(student.courseProgress[i]);
            }
            
        }

        // delete the student from the groups
        for( const group of student.groups){
            // console.log(groups);
            
        const existGroup = await Group.findById(group);
              existGroup.students= existGroup.students.filter(item => item !== student._id);

              await existGroup.save()

        }
        


        await Student.findByIdAndDelete(user.profileRef);
    }else if(user.role === 'instructor'){
        // delete the instructor's profile
        let instructor = await Instructor.findById(user.profileRef);
        if(!instructor){
            return res.status(404).json({
                success: false,
                message: 'Instructor not found'
            });
        }
        // reject the instructor's application
        await Instructor.findByIdAndUpdate(user.profileRef, { $set: { status: 'rejected' } });
        return res.status(200).json({
            success: true,
            message: 'instructor rejected'
        });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'user deleted successfully'
    });
})




module.exports = {
    viewUser,
    getViews,
    showAllUsers,
    // uploadFileToGoogleDrive
    deleteUser
}
