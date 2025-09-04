const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectMongoose = require("./utils/connectMongoose");
const Logger = require("./utils/logger");
const path = require('path');
const passport = require('./passport');
// تهيئة متغيرات البيئة

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use(cors()); 
app.use(passport.initialize());

// Logging middleware
app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        body: req.body,
        ip: req.ip
    });
    next();
});

// Routes

const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
// const statisticsRoutes = require("./routes/statisticsRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const studentRoutes = require("./routes/studentRoutes");
const requestsRoutes = require("./routes/requestsRoutes");
const questionRoutes = require("./routes/question");
const feedbackRoutes = require("./routes/feedBack");
const courseProgressRoutes = require("./routes/courseProgress");

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructor",instructorRoutes)
app.use("/api/groups",groupRoutes)
app.use("/api/students",studentRoutes)
app.use("/api/requests",requestsRoutes)
app.use("/api/questions",questionRoutes)
app.use("/api/feedback",feedbackRoutes)
app.use("/api/courseProgress",courseProgressRoutes)

app.get("*", (req, res) => { 
    Logger.info('Root endpoint accessed');  
    res.send("not found api");
});

// Error handling middleware
app.use((err, req, res, next) => {
    // تسجيل تفاصيل الخطأ
    Logger.error('Server Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode || 500,
        body: req.body,
        params: req.params,
        query: req.query
    });
    
    // إرسال رسالة الخطأ للمستخدم
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// تشغيل السيرفر والاتصال بقاعدة البيانات
(async () => {
    try {
        // الاتصال بقاعدة البيانات
        await connectMongoose.connectDB(); 
        
        // تشغيل السيرفر
        app.listen(port, () => {
            Logger.info(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
})();



const User=require("./models/user")
const Group=require("./models/group")
const Course=require("./models/course")
const Lecture=require("./models/lecture")
const CourseProgress=require("./models/courseProgress").courseProgress
const LectureProgress=require("./models/courseProgress").LectureProgress
const Student=require("./models/student")
const Instructor=require("./models/instructor")
const ReqToEnroll=require("./models/reqToEnroll")
const FeedBack=require("./models/feedBack")
// const Question=require("./models/question")


const script=async()=>{
    const students=await Student.find({})
    let count=0;
    console.log("students",students.length);
   students.forEach ( async (student) => {
    count++;
    console.log("student",count);
    if(student.courses.length==0){
        console.log("student",student.user,"has no courses");
        return;
    }
    // if(student.courseProgress.length==student.courses.length){
        // console.log("student",student.user,"has all courses progress");
       // log all students
       
    //    console.log("students",students,"has all courses progress");
        // return;
    // }
    for(let i=0;i<student.groups.length;i++){
        const group=await Group.findById(student.groups[i]);
        const courseProgress=await CourseProgress.findOne({student:student._id,course:group.course});
        if(!courseProgress){
            console.log("courseProgress",student.groups[i],"not found");
            return;
        }
        if(!group){
            console.log("group",student.groups[i],"not found");
            return;
        }
        for(let j=0;j<group.lectures.length;j++){
            const lectureProgress=new LectureProgress({
                student:student._id,
                lecture:group.lectures[j],
                engagement:0,
                attendance:"absent",
                lectureScore:0,
                notes:"",
                task:{
                    taskStatus:"pending",
                    submittedAt:null,
                    file:"",
                    score:0,
                    notes:""
                }
            })
            courseProgress.lectureProgress.push(lectureProgress);
            await courseProgress.save();
            // console.log("courseProgress saved for student",student.user,"course",student.courses[i].title);
        }
   }
})
}
// script() 



const replaceUserIdWithStudentId = async () => {
    const groups = await Group.find({});
    console.log("groups", groups.length);
  
    let count = 0;
    groups.forEach(async (group) => {
        count++;
        console.log("group ", count, " ", group.title);
        console.log("students",group.students.length);
        group.students.forEach(async (student) => {
            const user=await User.findById(student)
            if(!user){
                console.log("user not found");
                // return;
            }
            const existingStudent=await Student.findOne({_id:student})
            if(existingStudent){
                console.log("this is a student",existingStudent);
            }
            else{
                console.log("this is not a student",user);
            }


        })
    })
  };
  
//   replaceUserIdWithStudentId();


const script2=async()=>{
   const students=await Student.find({})
   students.forEach(async (student) => {

    student.courseProgress.forEach(async (courseProgress) => {
        const thisCourseProgress=await CourseProgress.findById(courseProgress)
        if(!thisCourseProgress){
            console.log("courseProgress not found");
            return;
        }
        thisCourseProgress.course=student.courses[0];
        await thisCourseProgress.save();
    })
   }) 
   console.log("done");
}
// script2()



script3=async()=>{
    const groups=await Group.find({})
    groups.forEach(async (group) => {
        let students=[];

        group.students.forEach(async (student) => {
            students.push(student._id);
        })
        group.students=students;
        await group.save();
        const newGroup=await Group.findById(group._id)
        console.log("students",group.title,newGroup.students);
    })
}
// script3()
   
module.exports = app;   


 