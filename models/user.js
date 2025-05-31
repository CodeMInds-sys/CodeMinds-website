const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    phone: {
        type: String,
        required: [true, 'phone is required'],
        trim: true,
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
    profileRef:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'profileModel'
    },
    profileModel:{
        type: String,
        enum: ['Student', 'Instructor', 'Manager', 'Admin'],
        default:null
    }

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



// compare password 
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};




const User = mongoose.model("User", userSchema);

module.exports = User;

