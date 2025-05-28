const mongoose = require("mongoose");

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
    authToken: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
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





const User = mongoose.model("User", userSchema);

module.exports = User;

