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

  paymentProof: { type: String },
  paymentDate:{ type: Date },
  startedAt: { type: Date },

}, { timestamps: true });

// optional computed field
PackagePurchaseSchema.virtual('remainingSessions').get(function () {
  return this.totalSessions - this.consumedSessions;
});

module.exports = mongoose.model('Purchase', PackagePurchaseSchema);