const mongoose = require("mongoose");
const { Schema } = mongoose;
const lectureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos:[{
        type: String,
    }],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }],
    objectives:[{
        type: String,
    }],

    
})

module.exports = mongoose.model("Lecture", lectureSchema);