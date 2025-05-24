const { match } = require("assert");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const taskSubmissionSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    submissionLinks: [{
        type: {
            type: String,
            enum: ['github', 'drive', 'other'],
            required: true
        },
        url: {
            type: String,
            required: true,

        },
        description: {
            type: String
        }
    }],
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    lecturerFeedback: {
        type: String
    }
});

const courseSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // معلومات الدفع
    payment: {
        isPaid: {
            type: Boolean,
            default: false
        },
        amount: {
            type: Number,
            required: true
        },
        paidAt: {
            type: Date
        }
    },
    // تقدم الطالب في الكورس
    progress: {
        completedPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now
        }
    },
    // مواعيد المحاضرات
    schedule: [{
        date: Date,
        startTime: String,
        endTime: String,
        topic: String
    }],
    // التاسكات المقدمة
    taskSubmissions: [taskSubmissionSchema]
}); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [3, 'name must be at least 3 characters long'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email is invalid']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['user','student', 'instructor', 'manager', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    authToken: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    specialization: {
        type: String,
        required: function() { return this.role === 'instructor' }
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

// حذف الـ index القديم عند تشغيل التطبيق
userSchema.pre('save', async function() {
    try {
        await this.collection.dropIndex('email_1');
    } catch (error) {
        // تجاهل الخطأ إذا لم يكن الـ index موجوداً
    }
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// مقارنة كلمة المرور
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// إنشاء JWT token
userSchema.methods.createJWT = function() {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME || '1d' }
    );
};

const User = mongoose.model("User", userSchema);

module.exports = User;

