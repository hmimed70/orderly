const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/ProductController'); // Import product controller
const { isAuthenticated, isAdmin } = require('../middlewares/auth'); // Middleware to check authentication
const { upload } = require('../middlewares/Storage');



productRoutes.use(isAuthenticated);
productRoutes.get('/:id', productController.getProductDetails);
//productRoutes.use(isAdmin)
// Create a new product (requires authentication)

// Get all products (public access)
productRoutes.get('/', productController.getAllProducts);

// Get a single product by ID (public access)

productRoutes.use(isAdmin);

productRoutes.post('/',upload.single('image'), productController.createProduct);
// Update a product by ID (requires authentication)
productRoutes.put('/:id', productController.updateProduct);

// Delete a product by ID (requires authentication)
productRoutes.delete('/:id', productController.deleteProduct);

module.exports = productRoutes;
