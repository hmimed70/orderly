const catchAsyncError =  require("../middlewares/catchAsyncError");
const User =  require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/Features");
const { filterBody } = require("../utils/helpers");

exports.updateMe = catchAsyncError(async (req, res, next) => {

    if (req.body.password || req.body.passwordConfirm) {
      
      return next(
        new ErrorHandler(  'This route is not for password updates.  use /updateMyPassword for updating your password.',400)
      );
    }
     const filterdData = filterBody(req.body, ['fullname', 'username', 'email', 'state', 'type', 'gender']);
  
    const user = await User.findByIdAndUpdate(req.user.id, filterdData, {
      new: true,
      runValidators: true
    }).select('-password');
  
    res.status(200).json({
      status: 'success',
       user
    });
  });

  exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const deletedUser = await User.findByIdAndDelete(req.params.id);
  
    if (!deletedUser) {
      return next(new ErrorHandler('User not found',404)); 
    }
  
    res.status(200).json({
      success: true,
      message: "User Delete Successfully",
    });
  })

  /*
  exports.deleteMe = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(200).json({
      success: true,
      message: "User Delete Successfully",
    });
  });
*/
exports.createUser = catchAsyncError(async (req, res, next) => {

    const { fullname,phone, username, role, email, password, state, type, orderConfirmedPrice, handleLimit, gender} = req.body;
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    const nextUserNumber = lastUser 
      ? parseInt(lastUser.userId.slice(3)) + 1 
      : 1;
    const userId = `USR${String(nextUserNumber).padStart(4, '0')}`;
    const user = await User.create({
        fullname,
        username,
        role,
        phone,
        userId,
        email,
        password,
        state,
        type,
        orderConfirmedPrice,
        handleLimit,
        gender
    });
    res.status(200).json({
        success: true,
        message: "User created Successfully",
        user
      });
});

  exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const resultPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    // Get the total number of orders
    const usersCount = await User.countDocuments();
    
    // Initialize ApiFeatures with filtering and pagination logic
    const apiFeature = new ApiFeatures(User.find().select('-password'), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .pagination(resultPerPage, req.query.page);
      const filteredUsersCount = await User.find(apiFeature.query.getFilter()).countDocuments();
  
    // Execute the query to get the orders
    const users = await apiFeature.query;
    
    // Calculate the filtered orders count accurately
    //const filteredOrdersCount = await Order.find(apiFeature.query.getFilter()).countDocuments();
  
    // Send the response with both counts
    res.status(200).json({
      success: true,
      users,
      usersCount, // Total orders count without filter
      filteredUsersCount, // Total filtered orders count
      resultPerPage,
    });
  })
  exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        
        return next(new ErrorHandler('no user found with this id',404)); 
    }
    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
  });
  });
  exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };
  

  exports.updateUser = catchAsyncError(async (req, res, next) => {
    if (!req.body.password) {
      delete req.body.password; // Remove password from userData if not provided
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return next(new ErrorHandler('No user found with that ID', 404));
    }

    res.status(200).json({
      success: true,
      user
    });
  });