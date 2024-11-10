const Category = require('../models/categoryModel'); // Import the Category model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Error handler middleware
const ErrorHandler = require('../utils/errorHandler'); // Custom error handler (if used)

// CREATE CATEGORY
exports.createCategory = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.create({ name, description, createdBy: req.user._id });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
});

// GET ALL CATEGORIES
exports.getAllCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    return next(new ErrorHandler('No categories found', 404));
  }

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// GET SINGLE CATEGORY
exports.getCategoryDetails = catchAsyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// UPDATE CATEGORY
exports.updateCategory = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    category,
  });
});

// DELETE CATEGORY
exports.deleteCategory = catchAsyncError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
