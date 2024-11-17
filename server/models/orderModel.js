const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  confirmatrice: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default: null },
  invoice_information: {
      client: { type: String, required: true },
      phone1: { type: String, required: true },
      phone2: { type: String },
      wilaya: { type: String, required: true },
      commune: { type: String, required: true },
    },
    shipping_price: { type: Number, default: 0 },
    shipping_type: { type: String },
    note: { type: String },
    product_sku: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number },
    nbr_order: { type: String, unique: true },
    product_name: { type: String, required: true },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date
    },
    attempts: [
      {
        timestamp: {
          type: Date,
          required: true,
        },
        attempt: {
          type: String,
          enum: ['pending', 'inProgress', 'confirmed', 'cancelled', 'didntAnswer1', 'didntAnswer2', 'didntAnswer3', 'didntAnswer4','phoneOff', 'duplicate', 'wrongNumber', 'wrongOrder']
            },
      },
    ],
    status: { type: String, enum: ['pending', 'inProgress', 'confirmed', 'cancelled', 'didntAnswer1', 'didntAnswer2', 'didntAnswer3', 'didntAnswer4','phoneOff', 'duplicate', 'wrongNumber', 'wrongOrder'], default: 'pending' },
  },
  { timestamps: true }
);
orderSchema.index({ createdAt: 1 });
orderSchema.index({ confirmatrice: 1 });
orderSchema.index({ confirmatrice: 1, status: 1 });
orderSchema.index({ nbr_order: -1 });
//OrderSchema.index({ product_sku: "text", note: "text" });
orderSchema.index({ createdAt: 1, status: 1 });

/*
// Pre-save middleware to generate nbr_order
orderSchema.pre('save', async function (next) {
  const order = this;

  // Only generate nbr_order if it's a new order
  if (!order.isNew) return next();

  try {
    // Get the last order from the database
    const lastOrder = await mongoose.model('Order').findOne().sort({ createdAt: -1 });

    let nextOrderNumber = 1; // Default to 1 if no previous order exists

    if (lastOrder) {
      const lastOrderNumber = parseInt(lastOrder.nbr_order.slice(3)); // Extract number from 'ORD0001'
      nextOrderNumber = lastOrderNumber + 1;
    }

    // Format the next order number as 'ORD0001', 'ORD0002', etc.
    order.nbr_order = `ORD${String(nextOrderNumber).padStart(4, '0')}`;

    next(); // Continue saving the order
  } catch (error) {
    next(error); // Pass any error to Mongoose
  }
});
*/
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Utility function to get the start and end dates for the current week
function getWeekRange() {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday as start
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday as end
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Utility function to get the start and end dates for the current month
function getMonthRange() {
  const start = new Date();
  start.setDate(1); // First day of the month
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Last day of the month
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Static method to count confirmed orders today
orderSchema.statics.countConfirmedToday = async function () {
  const { start, end } = getTodayRange();
  return await this.countDocuments({
    status: 'confirmed',
    confirmedAt: { $gte: start, $lte: end }
  });
};

// Static method to count confirmed orders this week
orderSchema.statics.countConfirmedThisWeek = async function () {
  const { start, end } = getWeekRange();
  return await this.countDocuments({
    status: 'confirmed',
    confirmedAt: { $gte: start, $lte: end }
  });
};

// Static method to count confirmed orders this month
orderSchema.statics.countConfirmedThisMonth = async function () {
  const { start, end } = getMonthRange();
  return await this.countDocuments({
    status: 'confirmed',
    confirmedAt: { $gte: start, $lte: end }
  });
};
orderSchema.statics.countConfirmedOnDate = async function (date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Set to the start of the day
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // Set to the end of the day

  return await this.countDocuments({
    status: 'confirmed',
    confirmedAt: { $gte: start, $lte: end }
  });
};
// Static method to calculate monthly earnings for a user based on orderConfirmedPrice
orderSchema.statics.calculateMonthlyEarningsForUser = async function (userId, date) {
  const { start, end } = getMonthRange(date);  // Get the range for the given month

  // Count the number of confirmed orders for the user in the given month
  const totalConfirmedOrders = await this.countDocuments({
    confirmatrice: userId,  // Only get orders assigned to the user
    status: 'confirmed',  // Only count confirmed orders
    confirmedAt: { $gte: start, $lte: end },  // Filter by the month range
  });

  // Retrieve the user's orderConfirmedPrice
  const user = await User.findById(userId);

  // Calculate the total earnings for the user
  const totalEarnings = totalConfirmedOrders * user.orderConfirmedPrice;

  return totalEarnings;
};

  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order ;