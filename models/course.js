const mongoose = require('mongoose');
const { Schema } = mongoose;



const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    avilableGroups: [{
        ref: "Group",
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }]
})


module.exports = mongoose.model('Course', courseSchema);

