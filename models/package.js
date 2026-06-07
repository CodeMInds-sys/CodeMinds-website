const mongoose=require('mongoose');

const PackagePurchaseSchema= new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    sessionPerMonth:{
        type:Number,
        required:true
    },
    numberOfMonths:{
        type:Number,
        required:true,
    },
    numberOfSessions:{
        type:Number,
        required:true,
        default:0
    },
})

PackagePurchaseSchema.pre('save', function(next) {
    this.numberOfSessions =
        this.sessionPerMonth * this.numberOfMonths;

    next();
});



module.exports=mongoose.model("Package",PackagePurchaseSchema);
