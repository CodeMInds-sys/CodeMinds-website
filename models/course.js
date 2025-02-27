const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'يرجى إدخال اسم الكورس'],
        trim: true,
        minlength: [3, 'اسم الكورس يجب أن يكون 3 أحرف على الأقل']
    },
    description: {
        type: String,
        required: [true, 'يرجى إدخال وصف الكورس'],
        trim: true,
        minlength: [10, 'وصف الكورس يجب أن يكون 10 أحرف على الأقل']
    },
    price: {
        type: Number,
        required: [true, 'يرجى إدخال سعر الكورس'],
        min: [0, 'السعر يجب أن يكون أكبر من أو يساوي صفر']
    },
    image: {
        type: String,
        default: 'default-course.png'
    },
    imagePublicId: {
        type: String,
        default: null
    },
    instructors:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ] ,
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

});

// Virtual for enrolled students count
courseSchema.virtual('studentsCount').get(function() {
    return this.enrolledStudents.length;
});

module.exports = mongoose.model('Course', courseSchema);  

