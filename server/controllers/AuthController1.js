const jwt = require('jsonwebtoken');
const sendToken = require("../utils/sendToken");




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
