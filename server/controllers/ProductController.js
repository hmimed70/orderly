const Product = require('../models/productModel'); // Import the Product model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Error handler middleware
const ApiFeatures = require('../utils/Features');
const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');
const { validateInput } = require('../utils/ValidateInput');

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const requiredFields = ['name', 'selling_price', 'quantity', 'product_sku'];
  const missingFields = validateInput(req.body, requiredFields);
  if (missingFields.length > 0) {
    return next(new ErrorHandler(`Missing required fields: ${missingFields.join(', ')}`, 400));
  }
  if (req.body.selling_price && (req.body.selling_price <= 0 || isNaN(req.body.selling_price) )) {
    return next(new ErrorHandler('selling_price must be greater than 0', 400));
  }
  if (req.body.quantity && (req.body.quantity <= 0 || isNaN(req.body.quantity) )) {
    return next(new ErrorHandler('quantity must be greater than 0', 400));
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Check if a new image is uploaded
  if (req.file) {
    const previousImagePath = path.resolve(`uploads/${product.image}`); // Assuming images are stored in the 'uploads/' directory

    // Delete the old image if it exists
    if (product.image && fs.existsSync(previousImagePath)) {
      fs.unlinkSync(previousImagePath);
    }

    // Update the image field with the new image's filename
    req.body.image = req.file.filename;
  }

  // Update the product with new data
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product,
  });
});

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { name, selling_price, quantity, product_sku, description, youtube_url, facebook_url } = req.body;
  const requiredFields = ['name', 'selling_price', 'quantity', 'product_sku'];
  const missingFields = validateInput(req.body, requiredFields);
  if (missingFields.length > 0) {
    return next(new ErrorHandler(`Missing required fields: ${missingFields.join(', ')}`, 400));
  }
  if (selling_price <= 0 || isNaN(selling_price)) {
    return next(new ErrorHandler('selling_price must be greater than 0', 400));
  }
  if (quantity <= 0 || isNaN(quantity)) {
    return next(new ErrorHandler('quantity must be greater than 0', 400));
  }
  // Handle the form fields and files using multer
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });
  const nextProductNumber = lastProduct
    ? parseInt(lastProduct.nbr_product.slice(3)) + 1 
    : 1;

  const nbr_product = `PRD${String(nextProductNumber).padStart(4, '0')}`;
  
  const product = await Product.create({
    name,
    selling_price,
    quantity,
    product_sku,
    description,
    youtube_url,
    facebook_url,
    nbr_product,
    user: req.user._id ? req.user._id : null,
    // Assuming 'image' is the file uploaded
    image: req.file ? req.file.filename : null, // Save the image filename (timestamped)
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});


exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    
    const apiFeature = new ApiFeatures(Product.find().populate('user', 'fullname'), req.query)
      .searchPrd()
      .filter()
      .sort()
      .limitFields()
      .pagination(resultPerPage, req.query.page);
  
    const products = await apiFeature.query;
    if (!products) {
      return next(new ErrorHandler('No products found', 404));
    }
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount: products.length,
    });
  });
// GET ALL PRODUCTS

// GET SINGLE PRODUCT
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler('no product found with this id',404)); 
    }
    
    res.status(200).json({
      success: true,
      product,
  });
  });
// UPDATE PRODUCT

// DELETE PRODUCT
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const imagePath = path.resolve(`uploads/${product.image}`); // Assuming images are stored in the 'uploads/' directory

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});
