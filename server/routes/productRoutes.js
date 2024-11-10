const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/ProductController'); // Import product controller
const { isAuthenticated, isAdmin } = require('../middlewares/auth'); // Middleware to check authentication

productRoutes.use(isAuthenticated);
// Create a new product (requires authentication)

// Get all products (public access)
productRoutes.get('/', productController.getAllProducts);

// Get a single product by ID (public access)
productRoutes.get('/:id', productController.getProductDetails);

productRoutes.use(isAdmin);

// Update a product by ID (requires authentication)
productRoutes.put('/:id', productController.updateProduct);

productRoutes.post('/', productController.createProduct);
// Delete a product by ID (requires authentication)
productRoutes.delete('/:id', productController.deleteProduct);

module.exports = productRoutes;
