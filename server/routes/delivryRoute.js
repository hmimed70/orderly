const express = require('express');
const deliveryRoutes = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const { addToDelivery, getColisByTracking, updateColisToReadyForDelivery, calculateTarification, getLatestUpdatedColis, getTarification, posteTarification } = require("../controllers/DelivryController");

// Use authentication middleware for all routes
deliveryRoutes.use(isAuthenticated);

// Add orders to delivery
deliveryRoutes.post('/user/add-to-delivery', addToDelivery);

// lire Retrieve colis by tracking numbers
//deliveryRoutes.post('/user/colis-by-tracking', getColisByTracking);

// Update colis to "ready for delivery" status
//deliveryRoutes.post('/user/update-to-ready', updateColisToReadyForDelivery);

// Calculate tarification for orders
//deliveryRoutes.post('/user/tarification_post', posteTarification);

// Get the latest updated colis
//deliveryRoutes.get('/user/tarification_get', getTarification);

// Admin-only routes (requires isAdmin middleware)
//deliveryRoutes.use(isAdmin);

// You can add more admin-specific routes here if needed, for example:
// deliveryRoutes.post('/admin/some-admin-action', someAdminAction);

module.exports = deliveryRoutes;
