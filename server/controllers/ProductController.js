const Product = require('../models/productModel'); // Import the Product model
const catchAsyncError = require('../middlewares/catchAsyncError'); // Error handler middleware

// CREATE PRODUCT
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { name, price, genderRestriction, product_ref, product_sku, description } = req.body;

  const product = await Product.create({
    name,
   // category,
    product_ref,
    price,
    genderRestriction,
    product_sku,
    description,
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
    
    const apiFeature = new ApiFeatures(Product.find().populate('category'), req.query)
      .search()
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
    const product = await Product.findById(req.params.id).populate('category');
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
  const { productName, category, sellingPrice, buyingPrice, genderRestriction, sku, description } = req.body;

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    { productName, category, sellingPrice, buyingPrice, genderRestriction, sku, description },
    { new: true, runValidators: true }
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
