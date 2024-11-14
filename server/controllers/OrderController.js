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

  // Initialize an empty filter, which matches all documents if no date is provided
  let dateFilter = {};
  
  if (date && date.trim()) {
    const { startDate, endDate } = getDateRange(date);
    if (startDate && endDate) {
      dateFilter = { createdAt: { $gte: startDate, $lt: endDate } };
    }
  }

  const aggregation = [
    { $match: dateFilter }, // This will match all documents if dateFilter is {}
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
  const statuses = ['pending', 'inProgress', 'confirmed', 'cancelled'];

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
  const statuses = ['inProgress', 'confirmed', 'cancelled'];

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





  exports.getAllOrdersAdmin = catchAsyncError((req, res, next) => {
    getOrders(req, res, next, {active: true});
  });
  
  exports.getMyCurrentHandleOrder = catchAsyncError((req, res, next) => {
    getOrders(req, res, next,{ confirmatrice: req.user._id, active: true });
  });
  

  exports.listOrders = catchAsyncError((req, res, next) => {
    console.log('listOrders');
    getOrders(req, res, next, { confirmatrice: null, active: true });
  });
  
  exports.inactiveOrders =catchAsyncError( (req, res, next) => {
    console.log("inactive")
    getOrders(req, res, next,  { active: false });
  });
  
  const getOrders = async (req, res, next, filter = {}) => {
    const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const { date } = req.query;
    
    let query = Order.find(filter).populate('confirmatrice', 'fullname');
    
    // Apply date filtering if a date is provided
    if (date && date.trim()) {
      const dateRange = getDateRange(date);
      if (dateRange.startDate && dateRange.endDate) {
        query = query.where("createdAt").gte(dateRange.startDate).lt(dateRange.endDate);
      }
    }
    
    // Count all orders before applying pagination
    const ordersCount = await Order.countDocuments(filter);
    
    // Apply additional query features
    const apiFeature = new ApiFeatures(query, req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .pagination(resultPerPage, req.query.page);
    
    // Execute the query and get filtered orders
    const orders = await apiFeature.query;
    
    // Count filtered orders after all filters are applied
    const filteredOrdersCount = await Order.countDocuments(apiFeature.query.getFilter());
    
    res.status(200).json({
      success: true,
      orders,
      ordersCount,
      filteredOrdersCount,
      resultPerPage,
    });
  };
  
  

// GET ORDER DETAILS
exports.checkOrderAssignment = catchAsyncError(async (req, res, next) => {
  const orderId = req.body.orderId || req.params.id;
  const userId = req.user._id;
     if(req.user.role === 'admin') return next();
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

exports.trashOrders = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  console.log(req.body);
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return next(new ErrorHandler('No order IDs provided', 400));
  }

  // Update all specified orders to set `active` to false (soft delete)
  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { active: false, deletedAt: Date.now(), confirmatrice: null } }
  );

  if (result.matchedCount === 0) {
    return next(new ErrorHandler('No matching orders found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Orders moved to trash successfully',
    updatedCount: result.modifiedCount,
  });
});

 exports.recoverOrders = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  console.log('dpsogjfophjpoih',req.body);
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return next(new ErrorHandler('No order IDs provided', 400));
  }
  let confirmatrice = null
   if(req.role === 'confirmatrice') confirmatrice = req.user._id
  // Update all specified orders to set `active` to false (soft delete)
  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { active: true, deletedAt: null, status: 'pending', confirmatrice: confirmatrice, createdAt: Date.now() } }
  );

  if (result.matchedCount === 0) {
    return next(new ErrorHandler('No matching orders found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Orders moved to trash successfully',
    updatedCount: result.modifiedCount,
  });
 })
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
      status: { $in: ['pending', 'inProgress'] },
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
      { confirmatrice: user._id, status: 'inProgress' }
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

exports.changeStatus = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;
  console.log('status', req.body.status, 'order id', orderId);
  const validStatuses = [
    'pending', 'inProgress', 'confirmed', 'cancelled', 
    'didntAnswer1', 'didntAnswer2', 'didntAnswer3', 'didntAnswer4', 
    'phoneOff', 'duplicate', 'wrongNumber', 'wrongOrder'
  ];
  console.log('validStatuses');
  // Validate newStatus
  if (!validStatuses.includes(status)) {
    console.log('validStatuses');

    return next(new ErrorHandler('Invalid status value.', 400));
  }
    // Fetch the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler('Order not found', 400));
    }

    // If the new status is the same as the current status, return without updating
    if (order.status === status) {
      return res.status(200).json({
        success: true,
        message: 'Order already has this status',
        order,
      });
    }
    if(status === 'pending') order.confirmatrice = null;
    // Update the order's main status
    order.status = status;

    // Add a new attempt to the attempts history with timestamp
    order.attempts.push({
      timestamp: new Date(),
      attempt: status,
    });
    console.log('validStatuses');

    // Save the updated order
    const newOrd = await order.save();  
    console.log(newOrd);
    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      newOrd,
    });
})


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