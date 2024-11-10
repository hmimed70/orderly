const Attempt = require('../models/attemptModel'); // Import the Category model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Error handler middleware
const ErrorHandler = require('../utils/errorHandler'); // Custom error handler (if used)

// CREATE CATEGORY
exports.createAttempt = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Attempt.create({ name, description, createdBy: req.user._id });

  res.status(201).json({
    success: true,
    message: 'Attempt created successfully',
    category,
  });
});

// GET ALL CATEGORIES
exports.getAllAttempts = catchAsyncError(async (req, res, next) => {
  const attempts = await Attempt.find();

  if (!attempts || attempts.length === 0) {
    return next(new ErrorHandler('No Attempts found', 404));
  }

  res.status(200).json({
    success: true,
    count: attempts.length,
    attempts,
  });
});

// GET SINGLE CATEGORY
exports.getAttemptDetails = catchAsyncError(async (req, res, next) => {
  const attempt = await Attempt.findById(req.params.id);

  if (!attempt) {
    return next(new ErrorHandler('Attempt not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    attempt,
  });
});


// DELETE CATEGORY
exports.deleteAttempt = catchAsyncError(async (req, res, next) => {
  const attempt = await Attempt.findById(req.params.id);

  if (!attempt) {
    return next(new ErrorHandler('Attempt not found', 404));
  }

  await attempt.remove();

  res.status(200).json({
    success: true,
    message: 'Attempt deleted successfully',
  });
});
