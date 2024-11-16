const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const { promisify } = require('util');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;
  // Only check for Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new ErrorHandler('You are not logged in! Please log in to get access.', 401));
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ErrorHandler('The user belonging to this token no longer exists.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isAdmin = catchAsyncError((req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ErrorHandler('You do not have permission to access this route.', 403));
  }
  next();
});

exports.isUser = catchAsyncError((req, res, next) => {
  if (req.user.role !== 'confirmatrice') {
    return next(new ErrorHandler('You do not have permission to access this route.', 403));
  }
  next();
});
