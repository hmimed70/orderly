require('dotenv').config();
const Product = require('../models/productModel');
const axios = require('axios'); // Ensure axios is installed
const catchAsyncError = require('../middlewares/catchAsyncError'); // Assuming catchAsyncError middleware is defined
const ErrorHandler = require('../utils/errorHandler'); // Assuming ErrorHandler utility is defined
const Order = require("../models/orderModel");
const { getWilayaCode } = require('../utils/helpers');

const config = {
  headers: {
    'token': process.env.ZEXPRESS_TOKEN,
    'key': process.env.ZEXPRESS_KEY,
  },
}
exports.addToDelivery = catchAsyncError(async (req, res, next) => {
  const { id, tracking_number } = req.body;

  // Check if the order exists
  const existsOrder = await Order.findOne({ _id: id });
  if (!existsOrder) {
    return next(new ErrorHandler("Order not found", 404));
  }
  // Check if the tracking number already exists
  const trackingExists = await Order.findOne({ tracking_number });
  if (trackingExists) {
    return next(new ErrorHandler("Tracking number already exists", 400));
  }
  const existsProduct = await Product.findOne({ _id: existsOrder.product });
  if(!existsProduct) return next(new ErrorHandler("No product associated with this order", 404));
  // Check the order's status
  if (existsOrder.status !== "confirmed") {
    return next(
      new ErrorHandler(
        "Order must had confirmed before adding to Tracking_number",
        400
      )
    );
  }
  if (existsOrder.status_livraison !== null) {
    return next(
      new ErrorHandler(
        "Order had already been set to delivery",
        400
      )
    );
  }
  // Update the order with tracking number, status_livraison, and push to attempts
  const updatedOrder = await Order.updateOne(
    { _id: id }, // Match the order
    {
      $set: {
        status_livraison: "En_Preparation",
        tracking_number: tracking_number,
      },
      $push: {
        attempts: {
          timestamp: new Date(),
          attempt: "En_Preparation",
          user: req.user.fullName, // Assuming req.user contains authenticated user info
        },
      },
    }
  );

  if (!updatedOrder.modifiedCount) {
    return next(new ErrorHandler("Failed to update order", 500));
  }
  await Product.updateOne(
    { _id: existsOrder.product },
    { $inc: { quantity: -existsOrder.quantity, quantity_out: existsOrder.quantity } }
);  res.status(200).json({
    success: true,
    message: "Tracking number added successfully",
  });
});

/*
exports.addToDelivery = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return next(new ErrorHandler('No orders provided for delivery.', 400));
  }

  // Find all orders by the provided IDs
  const orders = await Order.find({ _id: { $in: orderIds }, status: 'confirmed', status_livraison: null });

  if (!orders || orders.length === 0) {
      return next(new ErrorHandler('No valid confirmed orders found for Delivery.', 404));
  }

  // Fetch all associated products to validate stock quantities
  const productIds = orders.map(order => order.product);
  const products = await Product.find({ _id: { $in: productIds } });

  // Create a map for easier product lookup
  const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
  }, {});

  for (let order of orders) {
      const product = productMap[order.product.toString()];
      if (!product) {
          return next(new ErrorHandler(`Product not found for order: ${order.nbr_order}`, 404));
      }
      if (order.quantity > product.quantity) {
          return next(new ErrorHandler(`Insufficient stock for product ${product.name} in order ${order.nbr_order}. Available: ${product.quantity}, Ordered: ${order.quantity}`, 400));
      }
  }
  const deliveryPayload = orders.map(order => ({
      TypeLivraison: order.shipping_type === "home" ? "0" : "1",
      TypeColis: "0", // Exchange: 1
      Confrimee: "",
      Client: order.invoice_information.client,
      MobileA: order.invoice_information.phone1,
      MboileB: order.invoice_information.phone2 || "",
      Adresse: order.invoice_information.commune,
      IDWilaya: getWilayaCode(order.invoice_information.wilaya) || "No wilaya",
      Commune: order.invoice_information.commune,
      Total: order.total,
      Note: order.note || '',
      TProduit: order.product_name || 'Test Produit',
      id_Externe: order.nbr_order,
      Source: "nk-fulfillment",
  }));

  const Colier = { Colis: deliveryPayload };

  try {
      const deliveryResponse = await axios.post('https://procolis.com/api_v1/add_colis', Colier, config);

      if (deliveryResponse.status === 200) {
          const updatePromises = deliveryResponse.data.Colis.map(async (colis) => {
              const order = await Order.findOneAndUpdate(
                  { nbr_order: colis.id_Externe },
                  {
                      $set: {
                          status_livraison: 'En Préparation',
                          tracking_number: colis.Tracking
                      }
                  }
              );

              // Decrease product quantity
              await Product.updateOne(
                  { _id: order.product },
                  { $inc: { quantity: -order.quantity, quantity_out: order.quantity } }
              );
          });

          await Promise.all(updatePromises);

          res.status(200).json({
              success: true,
              message: 'Orders successfully added to delivery and tracking numbers updated.',
              deliveryResponse: deliveryResponse.data, // Include API response for reference
          });
      } else {
          return next(new ErrorHandler('Failed to add orders to delivery service.', 500));
      }
  } catch (error) {
      return next(new ErrorHandler(error.message || 'An error occurred while adding orders to the delivery service.', 500));
  }
});
*/
  
exports.fetchTrackingDetails = async (trackingNumbers) => {
  const payload = {
    Colis: trackingNumbers,
  };

  try {
    // Make the external API request to fetch tracking details
    const response = await axios.post(
      'https://procolis.com/api_v1/lire',
      payload,
      config
    );
    const trackingDetails = response.data.Colis || [];

    for (let i = 0; i < trackingDetails.length; i++) {
      const trackingDetail = trackingDetails[i];
      const trackingNumber = trackingDetail.Tracking; // Adjust field name if different
      const situation = trackingDetail.Situation; // Adjust field name if different
      const actionDate = trackingDetail.DateH_Action; // Date field from API
      const order = await Order.findOne({ tracking_number: trackingNumber });
      // Map situations into grouped statuses
      let groupedStatus;
      switch (situation) {
        case 'Retour Stock':
        case 'Retour de Dispatche':
          groupedStatus = 'Retour';
          break;
        case 'Supprimée':
          groupedStatus = 'Supprimee';  
           break;
        case 'Livrée':
        case 'Livrée [ Encaisser ]':
          groupedStatus = 'Livrée';
          break;
        case 'Supprimée':
          groupedStatus = 'Supprimee';
          break;
        case 'En Préparation':
          groupedStatus = 'En_Preparation';
          break;
        case 'En Traitement - Prêt à Expédie':
          groupedStatus = 'En_Traitement';
          break;
        default:
          groupedStatus = 'En_Livraison';
          break;
      }

      if (order) {
        // If the order falls under the "Retour" category
        if (groupedStatus === 'Retour' || groupedStatus === 'Supprimee') {
          if (order.product && order.quantity) {
            await Product.findByIdAndUpdate(
              order.product,
              {
                $inc: {
                  quantity: order.quantity,
                  quantity_out: -order.quantity,
                },
              },
              { new: true }
            );
          }
          await Order.findOneAndUpdate(
            { tracking_number: trackingNumber },
            {
              $set: {
                active: false,
                deletedAt: new Date(),
                status_livraison: groupedStatus,
              },
              $push: {
                attempts: {
                  timestamp: new Date(),
                  attempt: situation,
                  user: 'ZR System',
                },
              },
            },
            { new: true }
          );
        }
        // If the order falls under the "Livrée" category
        else if (groupedStatus === 'Livrée') {
          await Order.findOneAndUpdate(
            { tracking_number: trackingNumber },
            {
              $set: {
                status_livraison: groupedStatus,
                shippedAt: actionDate ? new Date(actionDate) : new Date(),
              },
              $push: {
                attempts: {
                  timestamp: actionDate ? new Date(actionDate) : new Date(),
                  attempt: situation,
                  user: 'ZR System',
                },
              },
            },
            { new: true }
          );
        }
        // Update status if it has changed
        else if (order.status_livraison !== groupedStatus) {
          await Order.findOneAndUpdate(
            { tracking_number: trackingNumber },
            {
              $set: {
                status_livraison: groupedStatus,
              },
              $push: {
                attempts: {
                  timestamp: actionDate ? new Date(actionDate) : new Date(),
                  attempt: situation,
                  user: 'ZR System',
                },
              },
            },
            { new: true }
          );
        }
      }
    }

    return response.data; // Return the API response data (optional)
  } catch (error) {
    console.error('Error while fetching tracking details:', error);
    throw new Error('Error while fetching tracking details');
  }
};

  
// Mettre à jour les colis en "Prêt à expédier"
/*
exports.updateColisToReadyForDelivery = catchAsyncError(async (req, res, next) => {
  
  if (!Colis || !Array.isArray(Colis) || Colis.length === 0) {
    return next(new ErrorHandler('Colis doit être un tableau avec des numéros de suivi.', 400));
  }
    const response = await axios.post(
      `https://procolis.com/api_v1/pret`,
      req.body,
      {
        headers: {
          'token': 'ff1a82004fc1f7851bb423970bc3045248eadac93d9bc7b851255413f180b62a',
          'key': '03ac49275e2f44e384dab00294f6b4a3',
        },
      }
    );

    res.status(200).json(response.data);

});
*/
/*
// posteTarification 
exports.posteTarification = catchAsyncError(async (req, res, next) => {
  /*
  const { ordersNbr } = req.body;

  if (!ordersNbr || !Array.isArray(ordersNbr) || ordersNbr.length === 0) {
    return next(new ErrorHandler('Orders Should be an array of order nbr_order.', 400));
  }

    const response = await axios.post(
      `https://procolis.com/api_v1/tarification`,
      req.body,
      {
        headers: {
          'token': '29efd299c7b6a8bc8ce526ce734ee3de2fa81c4a9e46845dcfe44b587823a615',
          'key': 'aadd0923190b48098eb56c102278e24d',
        },
      }
    );
    console.log(response.data)

    res.status(200).json(response.data);
});
//Get Tarification
exports.getTarification = catchAsyncError(async (req, res, next) => {
    const response = await axios.get(
      'https://procolis.com/api_v1/tarification',
      {
        headers: {
          'token': '29efd299c7b6a8bc8ce526ce734ee3de2fa81c4a9e46845dcfe44b587823a615',
          'key': 'aadd0923190b48098eb56c102278e24d',
        },
      }
    );
    console.log(response)
    res.status(200).json(response.data);
});
*/