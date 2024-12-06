const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    nbr_payment: {type: String, required: true},
    userId: { // Reference to the User who requested the payment
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {type: String},
    ccp: {type: String},
    
    amount: { type: Number, required: true },
    method: { type: String, enum: ['RIB', 'Cash'], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'refused'], default: 'Pending' },
    image: { type: String }, // URL to payment receipt (added when status is "Done")
    paymentHandle: { // Admin's ID who handled the request
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
module.exports = Payment;
