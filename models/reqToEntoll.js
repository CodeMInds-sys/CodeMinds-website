const mongoose = require("mongoose");

const reqToEntollSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }
})

const reqToEntoll = mongoose.model("ReqToEntoll",reqToEntollSchema);
module.exports = reqToEntoll;
