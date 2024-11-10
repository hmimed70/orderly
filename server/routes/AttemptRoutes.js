const express = require('express');
const AttemptRoutes = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const attemptController = require('../controllers/AttemptController');

AttemptRoutes.use(isAuthenticated);
// CRUD routes for categories
AttemptRoutes.post('/', attemptController.createAttempt); // Create category
AttemptRoutes.get('/', attemptController.getAllAttempts); // Get all categories

AttemptRoutes.use(isAdmin);

AttemptRoutes.get('/:id', attemptController.getAttemptDetails); // Get single category by ID
AttemptRoutes.delete('/:id', attemptController.deleteAttempt); // Delete category by ID

module.exports = AttemptRoutes;
