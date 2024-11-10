const Order = require('../models/orderModel'); // Import the Order model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Async error handler middleware
const ErrorHandler = require('../utils/errorHandler'); // Custom error handler
const User = require('../models/userModel');
const ApiFeatures = require('../utils/Features');
const { getDateRange } = require('../utils/dateHelper');

const isNumber = (value) => typeof value === 'number' && !isNaN(value);

exports.createOrder = catchAsyncError(async (req, res, next) => {
 
  const { 
    invoice_information, 
    shipping_type, 
    shipping_price,
    note, 
    product_sku, 
    quantity, 
    price, 
    discount,
    product_ref 
  } = req.body;
  if(!isNumber(shipping_price) || !isNumber(quantity) || !isNumber(price) || !isNumber(discount)) {
    return next(new ErrorHandler('Invalid input. Please ensure all fields are provided', 403));
  }
  const total = (quantity * price) + shipping_price - (quantity * price * (discount / 100));
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  const nextOrderNumber = lastOrder 
    ? parseInt(lastOrder.nbr_order.slice(3)) + 1 
    : 1;
  const nbr_order = `ORD${String(nextOrderNumber).padStart(4, '0')}`;

  const order = await Order.create({
    invoice_information,
    shipping_price, 
    shipping_type,
    note,
    product_sku,
    quantity,
    price,
    discount,
    total,
    product_ref,
    nbr_order,
  });
  if(order) {
    req.app.get('socketio').emit('newOrder', order);
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});


exports.getStatistics = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
  const { date } = req.query;

  let dateFilter = {};
  if (date && date.trim()) {
    const { startDate, endDate } = getDateRange(date);
    if (startDate && endDate) {
      dateFilter = { createdAt: { $gte: startDate, $lt: endDate } };
    }
  }

  const aggregation = [
    { $match: dateFilter },

    { 
      $group: {
        _id: '$confirmatrice', // Group by confirmatrice ID
        confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    },

    { 
      $lookup: {
        from: 'users', 
        localField: '_id',
        foreignField: '_id',
        as: 'confirmatriceDetails'
      }
    },

    { $unwind: '$confirmatriceDetails' }, 
    { 
      $project: {
        _id: 1,
        confirmedOrders: 1,
        cancelledOrders: 1,
        fullname: '$confirmatriceDetails.fullname' // Add confirmatrice's fullname
      }
    }
  ];

  try {
    const result = await Order.aggregate(aggregation);

    const ordersCount = await Order.countDocuments();
    const filteredOrdersCount = await Order.countDocuments(dateFilter);

    res.status(200).json({
      success: true,
      orders: result,
      ordersCount,
      filteredOrdersCount,
      resultPerPage,
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


exports.getOrderCountsByStatusAdmin = catchAsyncError(async (req, res, next) => {
  const statuses = ['pending', 'in-progress', 'confirmed', 'cancelled'];

  const counts = await Promise.all(
    statuses.map((status) => Order.countDocuments({ status }))
  );

  res.status(200).json({
    success: true,
    counts: {
      pending: counts[0],
      inProgress: counts[1],
      confirmed: counts[2],
      cancelled: counts[3],
    },
  });
});
const moment = require('moment'); 
const { default: mongoose } = require('mongoose');


exports.getOrderCountsByStatusUser = catchAsyncError(async (req, res, next) => {
  const statuses = ['in-progress', 'confirmed', 'cancelled'];

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found.', 404));
  }

  const counts = await Promise.all(
    statuses.map((status) => Order.countDocuments({ status, confirmatrice: req.user._id }))
  );

  const currentMonth = moment().month() + 1; // month is 0-indexed, so add 1
  const currentYear = moment().year();

  const dailyEarnings = await Order.aggregate([
    {
      $match: {
        status: 'confirmed',
        confirmatrice: req.user._id,
        confirmedAt: { 
          $gte: new Date(currentYear, currentMonth - 1, 1),  // Start of the month
          $lt: new Date(currentYear, currentMonth, 1)        // Start of the next month
        }
      }
    },
    {
      $lookup: {
        from: 'users', // Collection name for users
        localField: 'confirmatrice', // Field in Order
        foreignField: '_id', // Field in User
        as: 'confirmatriceDetails' // Output array field
      }
    },
    {
      $unwind: '$confirmatriceDetails' // Unwind the array to access the object
    },
    {
      $project: {
        day: { $dayOfMonth: '$confirmedAt' }, // Extract the day of the month from confirmedAt date
        earnings: '$confirmatriceDetails.orderConfirmedPrice' // Project earnings from the populated user field
      }
    },
    {
      $group: {
        _id: { day: "$day" }, // Group by day of the month
        totalConfirmedOrders: { $sum: 1 },
        totalEarnings: { $sum: '$earnings' }
      }
    },
    {
      $sort: { "_id.day": 1 } // Sort by day to keep the order in the results
    },
    {
      $project: {
        date: '$_id.day',
        totalConfirmedOrders: 1,
        totalEarnings: 1,
        averageEarningsPerOrder: {
          $cond: {
            if: { $gt: ['$totalConfirmedOrders', 0] },
            then: { $divide: ['$totalEarnings', '$totalConfirmedOrders'] },
            else: 0
          }
        }
      }
    }
  ]);
  

  const orders = await Order.find({
    status: 'confirmed',
    confirmatrice: req.user._id,
    confirmedAt: { $gte: new Date(currentYear, currentMonth - 1, 1), $lt: new Date(currentYear, currentMonth, 1) }
  });
  
  // Calculate earnings for the current month from daily earnings data
  const earningsThisMonth = dailyEarnings.reduce((acc, entry) => acc + entry.totalEarnings, 0);
  const totalConfirmedOrders = dailyEarnings.reduce((acc, entry) => acc + entry.totalConfirmedOrders, 0);

  res.status(200).json({
    success: true,
    counts: {
      inProgress: counts[0],
      confirmed: counts[1],
      cancelled: counts[2],
    },
    orders,
    earningsThisMonth,
    totalConfirmedOrders,
    dailyEarnings, // Return daily earnings data for the current month
  });
});


exports.getAllOrdersAdmin = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 1000;
  const {  date } = req.query;
  let query = Order.find().populate('confirmatrice', 'fullname');

  if (date && date.trim()) {
    const { startDate, endDate } = getDateRange(date);
    
  query = query.where("createdAt").gte(startDate).lt(endDate);
  
}

  const ordersCount = await Order.countDocuments();

  const apiFeature = new ApiFeatures(query, req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagination(resultPerPage, req.query.page);

  const orders = await apiFeature.query;

  const filteredOrdersCount = await Order.countDocuments(apiFeature.query.getFilter());

  res.status(200).json({
    success: true,
    orders,
    ordersCount, 
    filteredOrdersCount, 
    resultPerPage,
  });
});




exports.getMyCurrentHandleOrder = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
  
  const userId = req.user._id; // Ensure `userId` is defined before using
  const { date } = req.query;
  let query = Order.find({ confirmatrice: userId }).populate('confirmatrice', 'fullname');

  if (date && date.trim()) {
    const { startDate, endDate } = getDateRange(date);

    if (startDate && endDate) {
      query = query.where("createdAt").gte(startDate).lt(endDate);
    }
  }

  const ordersCount = await Order.countDocuments({ confirmatrice: userId });

  const apiFeature = new ApiFeatures(query, req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagination(resultPerPage, req.query.page);

  // Execute the query to get the filtered orders
  const orders = await apiFeature.query;

  // Count filtered orders
  const filteredOrdersCount = await Order.countDocuments(apiFeature.query.getFilter());


  // Send the response
  res.status(200).json({
    success: true,
    orders,
    ordersCount,
    filteredOrdersCount,
    resultPerPage,
  });
});

exports.listOrders = catchAsyncError(async (req, res, next) => {

  const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
  const {  date } = req.query;

  let query =  Order.find({ confirmatrice: null });

    if (date && date.trim()) {
      const { startDate, endDate } = getDateRange(date);
  
      if (startDate && endDate) {
        query = query.where("createdAt").gte(startDate).lt(endDate);
      }
    } 
    const ordersCount = await Order.countDocuments({ confirmatrice: null });
    
    const apiFeature = new ApiFeatures(query, req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .pagination(resultPerPage, req.query.page);
      
      const orders = await apiFeature.query;
      const filteredOrdersCount = await Order.find(apiFeature.query.getFilter()).countDocuments();
    res.status(200).json({
      success: true,
      orders,
      ordersCount,
      resultPerPage,
      filteredOrdersCount
    });
  });

// GET ORDER DETAILS
exports.checkOrderAssignment = catchAsyncError(async (req, res, next) => {
  const orderId = req.body.orderId || req.params.id;
  const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
    if (String(order.confirmatrice) !== String(userId)) {
      return next(new ErrorHandler('Unauthorized access to this order', 403));
    }
    req.order = order;
    next();
  
});
exports.getOrderDetails = catchAsyncError(async (req, res, next) => {
   if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return next(new ErrorHandler('Invalid order id', 400));
   }
  const order = req.order || await Order.findById(req.params.id)
  .populate('confirmatrice', 'fullname');
    if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// DELETE ORDER
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});
exports.assignOrdersToUser = catchAsyncError(async (req, res, next) => {
  // Fetch the user
  const user = await User.findById(req.user._id);
  if (!user) {
      return next(new ErrorHandler('User not found', 404));
  }

  // Check if the user has active orders (pending or in-progress)
  const activeOrders = await Order.find({
      confirmatrice: user._id,
      status: { $in: ['pending', 'in-progress'] },
  });

  if (activeOrders.length > 0) {
      return next(new ErrorHandler('You must confirm or cancel all assigned orders before taking new ones.', 400));
  }

  // Fetch the latest pending orders (sorted by `createdAt` descending) that are unassigned
  const ordersToAssign = await Order.find({
      confirmatrice: null, // Only select orders without a confirmatrice
      status: 'pending' // Only select pending orders
  })
  .sort({ createdAt: -1 }) // Sort by creation date, latest first
  .limit(user.handleLimit); // Limit to the user's handle limit

  if (ordersToAssign.length === 0) {
      return next(new ErrorHandler('No available pending orders to assign.', 400));
  }

  // Inform the user if fewer orders than their limit are being assigned
  if (ordersToAssign.length < user.handleLimit) {
      //(`Only ${ordersToAssign.length} orders available to assign. User limit is ${user.handleLimit}.`);
  }

  // Update the unassigned orders to assign them to the user and mark as 'in-progress'
  await Order.updateMany(
      { _id: { $in: ordersToAssign.map(order => order._id) } },
      { confirmatrice: user._id, status: 'in-progress' }
  );
    req.app.get('socketio').emit('orderUpdate');

  res.status(200).json({
      success: true,
      message: `Successfully assigned ${ordersToAssign.length} pending orders to ${user.fullname}.`,
  });
});

// Confirm an order and update user earnings
exports.confirmOrder = catchAsyncError( async (req, res, next) => {
    const  orderId  = req.params.id;


    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler( 'Order not found.', 400));
    }

    if (order.status === 'confirmed' || order.status === 'cancelled') {

      return next(new ErrorHandler( 'This order has already been processed.', 400));

    }

    const user = await User.findById(order.confirmatrice);
    order.status = 'confirmed';
    order.confirmedAt = Date.now();
    await order.save();

    user.confirmedOrders += 1;
    user.earnings += user.orderConfirmedPrice;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Order ${orderId} confirmed successfully.`,
      user: {
        fullname: user.fullname,
        confirmedOrders: user.confirmedOrders,
        earnings: user.earnings,
      },
    });

});

exports.cancelOrder = catchAsyncError( async (req, res, next) => {
  const  orderId  = req.params.id;
   const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler( 'Order not found.', 404));
    }

    if (order.status === 'confirmed' || order.status === 'cancelled') {
        return next(new ErrorHandler( 'This order has already been processed.', 400));
    }
    if (order && order.attempts.length < 3 ) {
      return next(new ErrorHandler( 'you must be added at least 3 attempt before canceling order', 404));
  }
  
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();
     
    res.status(200).json({
      message: `Order ${orderId} has been cancelled.`,
      user: {
        fullname: req.user.fullname,
        confirmedOrders: req.user.confirmedOrders,
        earnings: req.user.earnings,
      },
    });
});


exports.updateOrderUser = catchAsyncError(async (req, res, next) => {
  const updatedData = req.body;
  const allowedUpdateFields = ['invoice_information', 'shipping_type', 'note', 'attempt'];

  // Filter the updated fields to only include the allowed ones
  const filteredData = Object.keys(updatedData).reduce((acc, key) => {
    if (allowedUpdateFields.includes(key)) {
      acc[key] = updatedData[key];
    }
    return acc;
  }, {});

  // Find the order by ID
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Restrict updates for already processed orders
  if (['confirmed', 'cancelled'].includes(order.status)) {
    return next(new ErrorHandler('This order has already been processed', 400));
  }

  // Handle `attempt` updates with interval and valid value restrictions
  if (filteredData.attempt && filteredData.attempt !== 0) {
    const newAttempt = parseInt(filteredData.attempt, 10);

    // Ensure attempt is between 1 and 5
    if (newAttempt < 1 || newAttempt > 5) {
      return next(new ErrorHandler('Attempt must be a value between 1 and 5.', 400));
    }
    const attemptExists = order.attempts.some(a => a.attempt === newAttempt);
    if (attemptExists) {
      return next(new ErrorHandler(`Attempt ${newAttempt} has already been made.`, 400));
    }
    // Check last attempt time and ensure at least 1 hour has passed
    const lastAttempt = order.attempts[order.attempts.length - 1];
    if (lastAttempt && (Date.now() - lastAttempt.timestamp.getTime() < 3600000)) {
      return next(new ErrorHandler('You can only update the attempt once every hour.', 400));
    }

    order.attempts.push({
      timestamp: new Date(),
      attempt: newAttempt,
      note: `Attempt ${newAttempt}: Attempt note here`, // Add the corresponding note for the attempt
    });

    // Remove the attempt field from filteredData to avoid overwriting attempts
    delete filteredData.attempt;
  }

  // Update the order with the filtered data (excluding attempt) and the updated attempts
  order = await Order.findByIdAndUpdate(req.params.id, { ...filteredData, attempts: order.attempts }, {
    new: true,
    runValidators: true,
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order,
  });
});

  // UPDATE ORDER
  exports.updateOrderAdmin = catchAsyncError(async (req, res, next) => {
    const updatedData = req.body;
     const { quantity, price, discount, shipping_price } = updatedData;
     const totalPrice = (quantity * price) + shipping_price - (quantity * price * (discount / 100));
  
    let order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
  
    order = await Order.findByIdAndUpdate(req.params.id, { ...updatedData, total: totalPrice }, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  });