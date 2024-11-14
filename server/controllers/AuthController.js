const catchAsyncError =  require("../middlewares/catchAsyncError");
const User =  require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");
const crypto = require('crypto');
const { sendPasswordResetEmail }= require('../utils/sendEmail');


exports.RegisterUser = catchAsyncError(async (req, res, next) => {

    const { fullname, username, role, email, password, state, type, orderConfirmedPrice, handleLimit, gender} = req.body;

    const user = await User.create({
        fullname,
        username,
        role,
        email,
        password,
        state,
        type,
        orderConfirmedPrice,
        handleLimit,
        gender
    });

    sendToken(user, 201, res);
});


exports.LoginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken( user, 200,req, res);
})

exports.logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


 

/*
exports.forgotPassword = catchAsyncError(async(req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler('Please enter Email', 404)); 
  }
  const user = await User.findOne({ email: req.body.email });

     if(!user) return next(new ErrorHandler('User Email doesnt register yet', 404));

     const userResetToken = await user.getResetPasswordToken();
     await user.save({ validateBeforeSave: false });


      try {
        const resetURL = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/users/resetPassword/${userResetToken}`;
        await sendPasswordResetEmail(user, resetURL, `${__dirname}/../view/reset-password.handlebars`);
      
        res.status(200).json({
          status: 'success',
          message: `Token sent to ${user.email} successfully`,
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
          new ErrorHandler('There was an error sending the email. Try again later!'),
          500
        );
      }

});


exports.resetPassword = catchAsyncError(async (req, res, next) => {

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorHandler('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();


  sendToken(user, 200,req, res);
});
*/
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new ErrorHandler('User not found.', 404));
    }

    const isMatch = await user.comparePassword(req.body.passwordCurrent);
    if (!isMatch) {
      return next(new ErrorHandler('Your current password is incorrect.', 401));
    }

    user.password = req.body.password;

    await user.save();

    sendToken(user, 200, req, res);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.errors);
      return next(new ErrorHandler(`Validation Error: ${error.message}`, 400));
    }
    return next(error);
  }
});



