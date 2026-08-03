const mongoose = require('mongoose');

const PackagePurchaseSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },

  package: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Package', 
    required: true 
  },

  requiredAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  totalSessions: { type: Number, required: true },
  consumedSessions: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ['pending', 'paid','late'], 
    default: 'pending' 
  },

  paymentDate:{
     type: Date,
  },
  startedAt: { 
    type: Date,
   },

  paymentProof: {
  type: String, // image url
  },

  proofAnalysis: {
    detectedAmount:{ type: Number ,default: 0},
    sender: { type: String ,default: ""},
    receiver: { type: String ,default: ""},
    confidence: { type: Number ,default: 0}, // نسبة ثقة الـ AI
    extractedText: { type: String ,default: ""}, // OCR text لو محتاجه
  },

  proofVerification: {
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verifiedAt: { type: Date ,default: null},
    notes: { type: String ,default: ""},
    
  }
}, { timestamps: true });

// optional computed field
PackagePurchaseSchema.virtual('remainingSessions').get(function () {
  return this.totalSessions - this.consumedSessions;
});

const Purchase = mongoose.model('Purchase', PackagePurchaseSchema);
module.exports = Purchase;