const User = require('../models/userModel');  
const Payment = require('../models/PaymentModel');  
const ErrorHandler = require('../utils/errorHandler');  
const catchAsyncError = require('../middlewares/catchAsyncError');  
const ApiFeatures = require('../utils/Features');
const checkUserAndAmount = async (userId, amount) => {
  const user = await User.findById(userId); 
  if (!user) throw new ErrorHandler('User not found', 404);  
  
  if (user.availableAmount < amount) {
    throw new ErrorHandler('Insufficient available amount', 400);  
  }
  return user;
};


const handlePaymentRequestAction = async (admin, user, paymentRequestId, status, paymentData) => {
  const paymentRequest = await Payment.findOne({ 
    _id: paymentRequestId,  // Find by paymentRequestId
    userId: user.id         // Ensure the userId matches the user's ID
  });

  if (!paymentRequest) throw new ErrorHandler('Payment request not found', 404);  // Throw error if payment request not found

  
  // Add the admin who handled the request
  paymentRequest.paymentHandle = admin;

  // Update payment data for the payment request
  if (paymentData) {
    paymentRequest.ccp = paymentData.ccp;
    paymentRequest.note = paymentData.note;

    // Handle the image (if present)
    if (paymentRequest.method === 'RIB' && paymentData.image) {
      
      paymentRequest.image = paymentData.image;  // Save the image (ensure you handle saving/uploading the image)
    }
  }

  if (status === 'accepted') {
    user.paidAmount += paymentRequest.amount;
    paymentRequest.status = 'accepted';
  } else if (status === 'refused') {
    user.availableAmount += paymentRequest.amount;  
    paymentRequest.status = 'refused';
  }
  await paymentRequest.save(); 
  await user.save();  

  return paymentRequest;
};

exports.handlePayment = catchAsyncError(async (req, res, next) => { 
  const {status, ccp, note, userId } = req.body;
  const paymentRequestId = req.params.id

  const user = await User.findById(userId);  // Find the user by ID

  if (!user) return next(new ErrorHandler('User not found', 404));  // Return error if user not found

  const paymentData = {
    ccp,
    note,
    image: req.file ? req.file.filename : null  // Handle image if present
  };

  const paymentRequest = await handlePaymentRequestAction(req.user.id, user, paymentRequestId, status, paymentData);

  res.status(200).json({
    success: true,
    message: `Payment request has been ${status} successfully.`,
    paymentRequest,
  });
});
const createPaymentRequest = async (paymentData, user) => {
  const lastPayment = await Payment.findOne().sort({ createdAt: -1 });
  const nextPaymentNumber = lastPayment 
    ? parseInt(lastPayment.nbr_payment.slice(3)) + 1 
    : 1;
  const nbr_payment = `PAY${String(nextPaymentNumber).padStart(4, '0')}`;
    const payment = new Payment({
   ...paymentData, 
   status: 'pending', 
   userId: user._id,
   nbr_payment: nbr_payment,
    createdAt: new Date(), }
  );

 user.availableAmount -= paymentData.amount;
  
  await payment.save(); 
  await user.save();  
  return payment;
};
exports.requestPayment = catchAsyncError(async (req, res, next) => {
  
  const { amount, method, note, ccp } = req.body;
  // Check for valid amount
  if (amount <= 0 || isNaN(amount)) {
    return next(new ErrorHandler('Amount must be greater than 0', 400));
  }

  // Check user and available amount
  const user = await checkUserAndAmount(req.user.id, amount);
  // Prepare the payment data object
  const paymentData = {
    amount,
    method,
  };
  // Conditionally add `ccp` and `note` if they are provided
  if (ccp && ccp !== "") {
    paymentData.ccp = ccp;
  }

  if (note && note !== "") {
    paymentData.note = note;
  }
  // Create the payment request
  const payment = await createPaymentRequest(paymentData, user);

  // Respond with success
  res.status(200).json({
    success: true,
    message: 'Payment request has been submitted successfully.',
    payment,
  });
});


exports.getPaymentHistory = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const { date } = req.query;
  let filter = {};
  if (req.user.role === 'admin') {
    // Admin can filter by `userId` if provided, or see all payments
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
  } else if (req.user.role === 'confirmatrice') {
    // Confirmator can only see their own payments
    filter.userId = req.user.id;
  } else {
    return next(new ErrorHandler('Unauthorized access', 403));
  }

  // Initialize the query with the determined filter
  let query = Payment.find(filter)
    .populate('userId', 'fullname')
    .populate('paymentHandle', 'fullname');


  const paymentsCount = await Payment.countDocuments(filter);

  // Apply additional query features
  const apiFeature = new ApiFeatures(query, req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagination(resultPerPage, req.query.page);

  // Execute the query and get filtered payments
  const payments = await apiFeature.query;

  // Count filtered payments after all filters are applied
  const filteredPaymentsCount = await Payment.countDocuments(apiFeature.query.getFilter());

  // Respond with the results
  res.status(200).json({
    success: true,
    payments,
    paymentsCount,
    filteredPaymentsCount,
    resultPerPage,
  });
});
exports.getSinglePayment = catchAsyncError(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('userId', 'fullname').populate('paymentHandle', 'fullname');
  if(!payment) {
      return next(new ErrorHandler('no product found with this id',404)); 
  }
  res.status(200).json({
    success: true,
    payment,
});
}); 
 /*
  exports.getAllPayments = catchAsyncError(async (req, res, next) => {
    // Fetch all payments and populate the user details
    const payments = await Payment.find()
      .populate('userId', 'name')  // Populate the user details (name field)
      .sort({ createdAt: -1 });  // Sort payments by creation date (newest first)
  
    if (!payments || payments.length === 0) {
      return next(new ErrorHandler('No payments found', 404));  // Return error if no payments found
    }
  
    // Group payments by userId (assuming userId is the field linking Payment to User)
    const paymentsGroupedByUser = payments.reduce((acc, payment) => {
      const userId = payment.userId._id.toString();  // Convert to string to ensure consistency
  
      if (!acc[userId]) {
        acc[userId] = {
          user: payment.userId, // Store user details
          payments: [],  // Store user's payments
        };
      }
  
      acc[userId].payments.push(payment);  // Add the payment to the user's list of payments
  
      return acc;
    }, {});
  
    // Convert the object to an array of user-payment pairs
    const groupedPaymentsArray = Object.values(paymentsGroupedByUser);
  
    res.status(200).json({
      success: true,
      payments: groupedPaymentsArray,  // Send grouped payments
    });
  });
*/  