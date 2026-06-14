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

  totalSessions: { type: Number, required: true },
  consumedSessions: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ['pending', 'active', 'paused', 'expired', 'cancelled'], 
    default: 'pending' 
  },

  paymentDate:{ type: Date },
  startedAt: { type: Date },

  paymentProof: {
  type: String, // image url
  },

  proofAnalysis: {
    detectedAmount: Number,
    sender: String,
    receiver: String,
    confidence: Number, // نسبة ثقة الـ AI
    extractedText: String, // OCR text لو محتاجه
  },

  proofVerification: {
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verifiedAt: Date,
    notes: String

    
  }
}, { timestamps: true });

// optional computed field
PackagePurchaseSchema.virtual('remainingSessions').get(function () {
  return this.totalSessions - this.consumedSessions;
});

module.exports = mongoose.model('Purchase', PackagePurchaseSchema);