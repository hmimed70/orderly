const Product = require('../models/productModel'); // Import the Product model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Error handler middleware
const ApiFeatures = require('../utils/Features');

exports.createProduct = catchAsyncError(async (req, res, next) => {
  // Handle the form fields and files using multer
  const { name, selling_price, quantity, product_sku, description, youtube_url, facebook_url } = req.body;
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
exports.updateProduct = catchAsyncError(async (req, res, next) => {

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,req.body, { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product,
  });
});

// DELETE PRODUCT
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});
