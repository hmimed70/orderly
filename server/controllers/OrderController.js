const Order = require('../models/orderModel'); // Import the Order model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Async error handler middleware
const ErrorHandler = require('../utils/errorHandler'); // Custom error handler
const User = require('../models/userModel');
const ApiFeatures = require('../utils/Features');
const { getDateRange } = require('../utils/dateHelper');
const Product = require('../models/productModel');

const isNumber = (value) => typeof value === 'number' && !isNaN(value);




const validateInput = (inputData, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!inputData[field] || (typeof inputData[field] === 'string' && inputData[field].trim() === '')) {
      missingFields.push(field);
    }
  });

  return missingFields;
};

// Define required fields for the main payload and nested `invoice_information`
const requiredFields = [
  'invoice_information',
  'shipping_type',
  'product_sku',
  'quantity',
  'price',
  'product_name'
];
const requiredInvoiceFields = ['client', 'phone1', 'wilaya', 'commune'];

// Function to validate the payload
const validatePayload = (payload) => {
  // Validate top-level fields
  const missingFields = validateInput(payload, requiredFields);

  // Validate nested `invoice_information`
  const missingInvoiceFields = payload.invoice_information
    ? validateInput(payload.invoice_information, requiredInvoiceFields)
    : requiredInvoiceFields.map(field => `invoice_information.${field}`);

  // Combine all missing fields
  const allMissingFields = [
    ...missingFields,
    ...missingInvoiceFields.map(field => `invoice_information.${field}`)
  ];

  return allMissingFields;
};





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
    { $match: dateFilter }, // Match documents based on dateFilter
    { 
      $group: {
        _id: '$confirmatrice', // Group by confirmatrice ID
        confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        shippedOrders: { $sum: { $cond: [{ $ifNull: ['$shippedAt', false] }, 1, 0] } },
        retourOrders: { $sum: { $cond: [{ $eq: ['$status_livraison', 'Retour'] }, 1, 0] } },
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
        retourOrders: 1,
        shippedOrders: 1, // Include shippedOrders in the output
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

  const statusLivraisonCounts = await Order.aggregate([
    {
      $match: {
        status_livraison: { $ne: null } 
      }
    },
    {
      $group: {
        _id: '$status_livraison', 
        count: { $sum: 1 } 
      }
    },
    {
      $sort: { _id: 1 } 
    }
  ]);

  const combinedStatusLivraisonCounts = {};
  statusLivraisonCounts.forEach(status => {
    combinedStatusLivraisonCounts[status._id] = status.count;
  });

  
  res.status(200).json({
    success: true,
    counts: {
      pending: counts[0],
      inProgress: counts[1],
      confirmed: counts[2],
      cancelled: counts[3],
    },
    statusLivraisonCounts: combinedStatusLivraisonCounts // Include the aggregated status_livraison counts
  });
});


const moment = require('moment'); 
const { default: mongoose } = require('mongoose');
const { fetchTrackingDetails } = require('./DelivryController');





exports.getOrderCountsByStatusUser = catchAsyncError(async (req, res, next) => {
  const statuses = ['inProgress', 'confirmed', 'cancelled'];

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found.', 404));
  }

  // Get the count of orders for each status (inProgress, confirmed, cancelled) for the current confirmatrice
  const counts = await Promise.all(
    statuses.map((status) => Order.countDocuments({ status, confirmatrice: req.user._id }))
  );

  const currentMonth = moment().month() + 1; // month is 0-indexed, so add 1
  const currentYear = moment().year();

  // Aggregating daily earnings for the confirmed orders in the current month
  const dailyEarnings = await Order.aggregate([
    {
      $match: {
        status: 'confirmed',
        confirmatrice: req.user._id,
        shippedAt: { 
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
        day: { $dayOfMonth: '$shippedAt' }, // Extract the day of the month from shippedAt date
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

  // Get orders for the current month (shipped orders only)
  const orders = await Order.find({
    shippedAt: { $ne: null }, // Ensure 'shipped' is not null
    confirmatrice: req.user._id, // Match the current user's ID
    shippedAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1), // Greater than or equal to the first day of the current month
      $lt: new Date(currentYear, currentMonth, 1) // Less than the first day of the next month
    }
  });

  // Aggregating counts of `status_livraison` for the current `confirmatrice`
  const statusLivraisonCounts = await Order.aggregate([
    {
      $match: {
        confirmatrice: req.user._id, // Match the current user's ID
        status_livraison: { $ne: null } // Ensure `status_livraison` is not null
      }
    },
    {
      $group: {
        _id: '$status_livraison', // Group by `status_livraison`
        count: { $sum: 1 } // Count the number of orders for each `status_livraison`
      }
    },
    {
      $sort: { _id: 1 } // Sort by `status_livraison` value
    }
  ]);

  const combinedStatusLivraisonCounts = {};
  statusLivraisonCounts.forEach(status => {
    combinedStatusLivraisonCounts[status._id] = status.count;
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
    statusLivraisonCounts: combinedStatusLivraisonCounts // Include the aggregated status_livraison counts for the current confirmatrice
  });
});





exports.verifySecretKey = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];

  if (secretKey !== process.env.SECRET_KEY) {
      return res.status(403).send('Unauthorized: Invalid secret key');
  }
  next();
};
exports.createOrder = catchAsyncError(async (req, res, next) => {
  // Validate the payload
const allMissingFields = validatePayload(req.body);

if (allMissingFields.length > 0) {
  return next(new ErrorHandler(`missing fields : ${allMissingFields.join(', ')}`, 400));
  };
  const { 
    invoice_information, 
    shipping_type, 
    shipping_price,
    note, 
    product_sku, 
    quantity, 
    price, 
    product_name 
  } = req.body;
  const normalizedShippingPrice = isNumber(shipping_price) ? shipping_price : 0;

  if (!isNumber(quantity) || !isNumber(price)) {
    return next(new ErrorHandler('Invalid input. Please ensure all fields are provided', 403));
  }

  const total = (quantity * price) + normalizedShippingPrice;
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  const nextOrderNumber = lastOrder 
    ? parseInt(lastOrder.nbr_order.slice(3)) + 1 
    : 1;

  const nbr_order = `ORD${String(nextOrderNumber).padStart(4, '0')}`;
  let confirmatrice = null;
  if (req.user && req.user.role === 'confirmatrice') {
    confirmatrice = req.user._id;
  }
  let productId = null
   if(!req.body.product || req.body.product === null) {
     
     const product = await Product.findOne({ product_sku });
        if (product) {
       productId = product._id; // Assign the product ID if the product is found
     }
   }
  const order = await Order.create({
    invoice_information,
    shipping_price, 
    shipping_type,
    note,
    product_sku,
    quantity,
    price,
    status: 'pending',
    total,
    product_name,
    nbr_order,
    confirmatrice,
    product: req.body.product || productId,
    attempts: [{ timestamp: new Date(), attempt: "pending", user:   req?.user?.fullname || 'System'  }] // Add pending attempt
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
  exports.getAllOrdersAdmin = catchAsyncError((req, res, next) => {
    getOrders(req, res, next, {active: true});
  });
  
  exports.getMyCurrentHandleOrder = catchAsyncError((req, res, next) => {
    getOrders(req, res, next,{ confirmatrice: req.user._id, active: true });
  });
  

  exports.listOrders = catchAsyncError((req, res, next) => {
    getOrders(req, res, next, { confirmatrice: null,status: 'pending', active: true });
  });
  exports.changeStatus = catchAsyncError(async (req, res, next) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const validStatuses = [
      'pending', 'inProgress', 'confirmed', 'cancelled', 
      'didntAnswer1', 'didntAnswer2', 'didntAnswer3', 'didntAnswer4', 
      'phoneOff', 'duplicate', 'wrongNumber', 'wrongOrder'
    ];
    // Validate newStatus
    if (!validStatuses.includes(status)) {
  
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
      order.confirmedAt = status === 'confirmed' ? new Date() : null;
      order.cancelledAt = status === 'cancelled' ? new Date() : null;
      // Update the order's main status
      order.status = status;
  
      // Add a new attempt to the attempts history with timestamp
      order.attempts.push({
        timestamp: new Date(),
        attempt: status,
        user: req?.user?.fullname || 'System'
      });
  
      // Save the updated order
      const newOrd = await order.save();  
      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        newOrd,
      });
  })

  exports.inactiveOrders =catchAsyncError( (req, res, next) => {
    getOrders(req, res, next,  { active: false });
  });
  
  const getOrders = async (req, res, next, filter = {}) => {
    const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const { date } = req.query;
    
    let query = Order.find(filter).populate('confirmatrice', 'fullname').populate('product', 'image');
    
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
  const order = await Order.findById(req.params.id)
  .populate('confirmatrice', 'fullname').populate('product');
    if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }
  const finalStatuses = ['Livrée', 'Retour', 'Supprimee'];
  if (!finalStatuses.includes(order.status_livraison) && order.tracking_number) {
    await fetchTrackingDetails([{ Tracking: order.tracking_number }]);
  }
  res.status(200).json({
    success: true,
    order,
  });
});

exports.clearTrash = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return next(new ErrorHandler('No order IDs provided', 400));
  }

  // Update all specified orders to set `active` to false (soft delete)
  const result = await Order.deleteMany(
    { _id: { $in: orderIds } }  );

  if (result.matchedCount === 0) {
    return next(new ErrorHandler('No matching orders found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Orders deleted successfully',
    updatedCount: result.modifiedCount,
  });
});
exports.trashOrders = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return next(new ErrorHandler('No order IDs provided', 400));
  }

  // Update all specified orders to set `active` to false (soft delete)
  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { active: false, deletedAt: new Date() } }
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
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return next(new ErrorHandler('No order IDs provided', 400));
  }
  let confirmatrice = null;
  let stat = 'pending';
   if(req.user.role === 'confirmatrice') {

    confirmatrice = req.user._id;
   stat = 'inProgress'
  }
  const ordersToRecover = await Order.find({
    _id: { $in: orderIds },
    status_livraison: { $eq: null }, // Ensure status_livraison is null
  });

  // If no orders are found that can be recovered, return an error
  if (ordersToRecover.length === 0) {
    return next(new ErrorHandler('No orders found to recover or already delivered', 400));
  }

  // Update all specified orders to set `active` to false (soft delete)
  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { active: true, deletedAt: null, status: stat, confirmatrice: confirmatrice, createdAt: Date.now() },
    $push: { attempts: { timestamp: new Date(), attempt: stat, user:   req?.user?.fullname || 'System' } }
  }
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
  const order = await Order.findByIdAndUpdate(req.params.id,  {active: false, deletedAt: Date.now() }); 

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});
exports.assignOrdersToUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
      return next(new ErrorHandler('User not found', 404));
  }
  const activeOrders = await Order.find({
      confirmatrice: user._id,
      status: { $in: ['inProgress'] },
  });

  if (activeOrders.length > 0) {
      return next(new ErrorHandler('You must confirm or cancel all assigned orders before taking new ones.', 400));
  }

  const ordersToAssign = await Order.find({
      confirmatrice: null, 
      status: 'pending' 
  })
  .sort({ createdAt: -1 }) 
  .limit(user.handleLimit); 

  if (ordersToAssign.length === 0) {
      return next(new ErrorHandler('No available pending orders to assign.', 400));
  }

  await Order.updateMany(
    { _id: { $in: ordersToAssign.map(order => order._id) } },
    { 
      $set: { confirmatrice: user._id, status: 'inProgress' },
      $push: { attempts: { timestamp: new Date(), attempt: "inProgress", user:   req?.user?.fullname || 'System' } }
    }
  );
  
    req.app.get('socketio').emit('orderUpdate');

  res.status(200).json({
      success: true,
      message: `Successfully assigned ${ordersToAssign.length} pending orders to ${user.fullname}.`,
    });
  });

  // UPDATE ORDER
  exports.updateOrderAdmin = catchAsyncError(async (req, res, next) => {
    const updatedData = req.body;
    const allMissingFields = validatePayload(req.body);

if (allMissingFields.length > 0) {
  return next(new ErrorHandler(`missing fields : ${allMissingFields.join(', ')}`, 400));
  };
     const { quantity, price, shipping_price } = updatedData;
     const totalPrice = (quantity * price) + shipping_price;
  
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