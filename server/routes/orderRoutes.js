const express = require('express');
const orderRoutes = express.Router();
const { createOrder, getOrderDetails,
    updateOrderUser , deleteOrder,
    assignOrdersToUser,cancelOrder,confirmOrder,
    getAllOrdersAdmin,getMyCurrentHandleOrder,
    listOrders, checkOrderAssignment, 
    updateOrderAdmin,
    getStatistics,
    getOrderCountsByStatusAdmin,
    getOrderCountsByStatusUser} = require('../controllers/OrderController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
orderRoutes.get('/user', listOrders);
orderRoutes.use(isAuthenticated);
orderRoutes.get('/user/current', getMyCurrentHandleOrder);
orderRoutes.put('/user/cancel/:id',checkOrderAssignment, cancelOrder);
orderRoutes.put('/user/confirm/:id',checkOrderAssignment, confirmOrder);
orderRoutes.post('/user/assign', assignOrdersToUser);
orderRoutes.get('/user/status-counts', getOrderCountsByStatusUser);

orderRoutes.get('/user/:id',checkOrderAssignment, getOrderDetails);
orderRoutes.put('/user/:id',checkOrderAssignment, updateOrderUser);

orderRoutes.use(isAdmin);
orderRoutes.get('/admin/status-counts', getOrderCountsByStatusAdmin);
orderRoutes.get('/statistics',getStatistics );
orderRoutes.post('/admin', createOrder)
.delete('/admin/:id', deleteOrder)
.get('/admin', getAllOrdersAdmin)
.put('/admin/:id', updateOrderAdmin)
.get('/admin/:id', getOrderDetails);
module.exports = orderRoutes;
