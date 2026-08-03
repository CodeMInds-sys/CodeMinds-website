


const Purchase = require('../models/Purchase');

const asyncHandler = require('../utils/asyncHandler');

const { uploadToCloudinary } = require('../utils/cloudinary');

//   let imageUrl = 'default-course.png';
//     let imagePublicId = null;
  
//     if (req.file) {
//       try {
//         // تحويل Buffer إلى base64
//         const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
//         // رفع الملف إلى Cloudinary
//         const uploadResult = await uploadToCloudinary(fileStr, req.file.originalname);
//         imageUrl = uploadResult.url;
//         imagePublicId = uploadResult.public_id;

//         console.log(imageUrl,imagePublicId);
//       } catch (error) {
//         console.error('Error uploading to Cloudinary:', error);
//         return res.status(500).json({ 
//             success: false,
//             message: 'فشل في رفع الصورة إلى Cloudinary' ,
//             data: null
//         });
//       }
//     }
  
// add purchase

// const addPurchase = asyncHandler(async (req, res) => {
 
//     const { student,} = req.body;
//     const myPackage = await Package.findOne({numberOfMonths:1});
//     const purchase = await Purchase.create({ student, package : myPackage._id ,totalSessions: myPackage.numberOfSessions, requiredAmount: myPackage.price});

//     res.status(201).json({
//         success: true,
//         message: 'purchase created successfully',
//         data: purchase
//     });
// });


const uploadPaymentProofByAdmin = asyncHandler(async (req, res) => {
    console.log(" upload payment proof by admin");
    
    const {purchaseId,paidAmount} = req.body;
    if(!paidAmount){
      return res.status(400).json({
        success: false,
        message: 'Paid amount is required',
        data: null
      });
    } 
    const purchase = await Purchase.findById(purchaseId);
    if(!purchase){
        return res.status(404).json({
            success: false,
            message: 'Purchase not found',
            data: null
        });
    }
    // TODO: implement upload payment proof by admin


    
    let imageUrl = 'default-course.png';
    let imagePublicId = null;
  
    if (req.file) {
      try {
        // تحويل Buffer إلى base64
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
        // رفع الملف إلى Cloudinary
        const uploadResult = await uploadToCloudinary(fileStr, req.file.originalname);
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.public_id;

        console.log(imageUrl,imagePublicId);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ 
            success: false,
            message: 'فشل في رفع الصورة إلى Cloudinary' ,
            data: null
        });
      }
    }else{
      return res.status(400).json({
        success: false,
        message: 'No payment proof uploaded',
        data: null
      });
    }

    purchase.paymentProof = imageUrl;
    purchase.status = 'paid';
    purchase.proofVerification.status = 'verified';
   

    
    purchase.paidAmount = paidAmount;
    purchase.proofVerification.verifiedAt = new Date();
    await purchase.save();
    res.status(200).json({
        success: true,
        message: 'Payment proof uploaded successfully',
        data: purchase
    });
  
});



const getAllPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find().populate({
        path: 'student',
        populate: {
            path: 'user',
            select: 'name email phone'
        }
    }).populate({
        path: 'package',
        select: 'name price numberOfSessions numberOfMonths'
    })
    res.status(200).json({
        success: true,
        message: 'Purchases retrieved successfully',
        data: purchases
    });
});
module.exports = {
    // addPurchase,
    uploadPaymentProofByAdmin,
    getAllPurchases
};