const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const { promisify } = require('util');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  console.log("inside auth")  
  let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      console.log("Bearer token")  

      token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies.jwt) {
      console.log("cookies token")  

      token = req.cookies.jwt;
    }
    if (!token) {
      console.log("not login")  
      console.log(process.env.JWT_SECRET)
      return next(
        new ErrorHandler('You are not logged in! Please log in to get access.', 401)
      );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ErrorHandler(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorHandler('User recently changed password! Please log in again.', 401)
      );
    }
  
    req.user = currentUser;
    res.locals.user = currentUser;
    console.log("get me")
    next();
  });

  exports.isAdmin = catchAsyncError((req, res, next) => {
    if(req.user.role!== 'admin') {
     return next( new ErrorHandler('You dont have permission to access this route.', 403) );
    }
    next()
  })

  
  exports.isUser = catchAsyncError((req, res, next) => {
    if(req.user.role!== 'confirmatrice') {

     return next( new ErrorHandler('You dont have permission to access this route.', 403) );
    }
    next()
  })