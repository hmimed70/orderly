const express = require('express');
const orderRoutes = express.Router();
const { createOrder, getOrderDetails,
      deleteOrder,
    assignOrdersToUser,
    getAllOrdersAdmin,getMyCurrentHandleOrder,
    listOrders, checkOrderAssignment, 
    updateOrderAdmin,
    getStatistics,
    getOrderCountsByStatusAdmin,
    getOrderCountsByStatusUser,
    changeStatus,
    trashOrders,
    inactiveOrders,
    recoverOrders,
    clearTrash,
    verifySecretKey} = require('../controllers/OrderController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const { createSecretKey } = require('crypto');
orderRoutes.post(`/${process.env.HOOK_ROUTE}`, verifySecretKey, createOrder);
orderRoutes.use(isAuthenticated);
orderRoutes.get('/user', listOrders);
orderRoutes.get('/user/current', getMyCurrentHandleOrder);
orderRoutes.post('/user/assign', assignOrdersToUser);
orderRoutes.get('/user/status-counts', getOrderCountsByStatusUser);

orderRoutes.get('/user/inactive', inactiveOrders);
orderRoutes.post('/user/recover', recoverOrders);
orderRoutes.get('/user/:id',checkOrderAssignment, getOrderDetails);
orderRoutes.post('/user', createOrder)
orderRoutes.delete('/user/:id',checkOrderAssignment ,deleteOrder)
.put('/user/:id',checkOrderAssignment, updateOrderAdmin)
.get('/user/:id',checkOrderAssignment, getOrderDetails);
orderRoutes.put('/user/status/:id',checkOrderAssignment, changeStatus);
orderRoutes.use(isAdmin);
orderRoutes.post('/admin/trash', trashOrders);
orderRoutes.post('/admin/clear', clearTrash);

orderRoutes.get('/admin', getAllOrdersAdmin)
orderRoutes.get('/admin/status-counts', getOrderCountsByStatusAdmin);
orderRoutes.get('/statistics',getStatistics );
module.exports = orderRoutes;
