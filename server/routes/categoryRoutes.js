const express = require('express');
const categoryRoutes = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const categoryController = require('../controllers/CategoryController');

categoryRoutes.use(isAuthenticated);
// CRUD routes for categories
categoryRoutes.post('/', categoryController.createCategory); // Create category
categoryRoutes.get('/', categoryController.getAllCategories); // Get all categories

categoryRoutes.use(isAdmin);

categoryRoutes.get('/:id', categoryController.getCategoryDetails); // Get single category by ID
categoryRoutes.put('/:id', categoryController.updateCategory); // Update category by ID
categoryRoutes.delete('/:id', categoryController.deleteCategory); // Delete category by ID

module.exports = categoryRoutes;
