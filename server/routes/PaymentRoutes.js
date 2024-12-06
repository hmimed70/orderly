const express = require('express');
const paymentRoutes = express.Router();
const paymentController = require('../controllers/PaymentController'); // Import payment controller
const { isAuthenticated, isAdmin } = require('../middlewares/auth'); // Middleware to check authentication
const { upload } = require('../middlewares/Storage'); // Middleware for file upload (e.g., receipt)

paymentRoutes.use(isAuthenticated);
paymentRoutes.get('/history', paymentController.getPaymentHistory);
paymentRoutes.get('/user/:id',paymentController.getSinglePayment);

paymentRoutes.post('/request', paymentController.requestPayment);


// Admins can view any user's payment history by using the user id in the params
paymentRoutes.use(isAdmin);
//paymentRoutes.get('/', paymentController.getAllPayments); 

paymentRoutes.put('/handle/:id', upload.single('image'), paymentController.handlePayment);

module.exports = paymentRoutes;
