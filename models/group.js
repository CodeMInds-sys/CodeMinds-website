
const mongoose = require("mongoose");
const { Schema } = mongoose;
const groupSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
})

module.exports = mongoose.model("Group", groupSchema);