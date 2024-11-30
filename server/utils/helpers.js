const wilayas = require('./Wilaya.json');

exports.filterBody = (reqBody, allowedFields) => {
    const filteredBody = {};
    for (const key in reqBody) {
      if (allowedFields.includes(key)) {
        filteredBody[key] = reqBody[key];
      }
    }
    return filteredBody;
  }
  exports.getWilayaCode = (wilayaName) => {
    const wilaya = wilayas.find((w) => w.nom === wilayaName);
    return wilaya ? wilaya.code : "Unknown";
  };
  
  /*
  async function isProductPurchased(userId, productId) {
    // Find the order containing the product
    const order = await Order.findOne({ userId, items: { $elemMatch: { productId } } });
    
    // Check if order exists and is completed (replace 'completed' with your order status for purchase)
    return order && order.status === 'completed';
  }
  */