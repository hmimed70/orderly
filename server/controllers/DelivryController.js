require('dotenv').config();
const Product = require('../models/productModel');
const axios = require('axios'); // Ensure axios is installed
const catchAsyncError = require('../middlewares/catchAsyncError'); // Assuming catchAsyncError middleware is defined
const ErrorHandler = require('../utils/errorHandler'); // Assuming ErrorHandler utility is defined
const Order = require("../models/orderModel");
const { getWilayaCode } = require('../utils/helpers');
const tough = require('tough-cookie');
const User = require('../models/userModel');
const axiosCookieJarSupport = require('axios-cookiejar-support').wrapper; // Import the support for axios
const moment = require('moment');
const { auth } = require('../utils/auth');

const config = {
  headers: {
    'token': process.env.ZEXPRESS_TOKEN,
    'key': process.env.ZEXPRESS_KEY,
  },
}

// Add cookie jar support to axios
axiosCookieJarSupport(axios);

// Define the URL for the request

async function main() {
    // Sample data for the order
    const data = [{
        TypeColis: 0,
        TypeLivraison: 1,
        Client: `test test client`,
        MobileA: "989859685989898989",
        MobileB: "06568989888999",
        Adresse: "test adresse",
        IDWilaya: "35",
        Commune: "Boumerdès",
        Total: "1200",
        Qtn: 5,
        Note: "teste notes",
        TProduit: "test nom produit",
        id_Externe: "ORD5454"
    }];

    try {
        // Authenticate and get the cookie jar
        const cookieJar = await auth('zr_express_new');

        // Sending the POST request with the cookie jar
        const response = await axios.post(process.env.EXPRESS_LOGIN_URL, new URLSearchParams({
            WD_ACTION_: 'AJAXEXECUTE',
            EXECUTEPROCCHAMPS: 'PAGE_Colis.Chargement',
            WD_CONTEXTE_: 'A58',
            PA1: JSON.stringify(data)
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            jar: cookieJar, // Attach the cookie jar to the request
            withCredentials: true, // Ensure cookies are included in the request
            validateStatus: false // Disable status validation if needed
        });

        if (response.status === 200) {
            // Assuming xmlToJson is a method for parsing XML to JSON
            const xml = response.data;
            const jsonData = xmlToJson(xml); // You might need to define or import the xmlToJson function
        } else {
            console.error("Request failed with status:", response.status);
        }
    } catch (error) {
        console.error('Error during bulk order addition:', error);
    }
}

// Utility function to convert XML to JSON
// You may use a library like xml2js or define your own function
function xmlToJson(xml) {
    const parseString = require('xml2js').parseString;
    let jsonData = {};
    parseString(xml, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
        } else {
            jsonData = result;
        }
    });
    return jsonData;
}

// Execute the main function

/*
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
*/
exports.addToDelivery = catchAsyncError(async (req, res, next) => {
  const { orderIds } = req.body; // Expect an array of order IDs
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return next(new ErrorHandler('No orders provided for delivery.', 400));
  }

  // Find all orders by the provided IDs
  const orders = await Order.find({
      _id: { $in: orderIds },
      status: 'confirmed',
      status_livraison: null,
  });

  if (!orders || orders.length === 0) {
      return next(new ErrorHandler('No valid confirmed orders found for delivery.', 404));
  }

  // Fetch all associated products to validate stock quantities
  const productIds = orders.map((order) => order.product);
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
          return next(
              new ErrorHandler(
                  `Insufficient stock for product ${product.name} in order ${order.nbr_order}. Available: ${product.quantity}, Ordered: ${order.quantity}`,
                  400
              )
          );
      }
  }

  const deliveryPayload = orders.map((order) => ({
      TypeLivraison: order.shipping_type === 'home' ? '0' : '1',
      TypeColis: '0', // Exchange: 1
      Client: order.invoice_information.client,
      MobileA: order.invoice_information.phone1,
      MobileB: order.invoice_information.phone2 || '',
      Adresse: order.invoice_information.commune,
      IDWilaya: getWilayaCode(order.invoice_information.wilaya) || 'No wilaya',
      Commune: order.invoice_information.commune,
      Total: order.total,
      Note: order.note || '',
      TProduit: order.product_name,
      id_Externe: order.nbr_order,
      Source: 'nk-fulfillment',
  }));

  try {
      // Authenticate and get cookies
      const cookieJar = await auth('zr_express_new');

      // Send delivery request with authenticated cookies
      const response = await axios.post(
          process.env.EXPRESS_LOGIN_URL,
          new URLSearchParams({
              WD_ACTION_: 'AJAXEXECUTE',
              EXECUTEPROCCHAMPS: 'PAGE_Colis.Chargement',
              WD_CONTEXTE_: 'A58',
              PA1: JSON.stringify(deliveryPayload),
          }).toString(),
          {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              jar: cookieJar,
              withCredentials: true,
              validateStatus: false,
          }
      );

      if (response.status !== 200) {
          throw new ErrorHandler(`Failed to send delivery request. Status code: ${response.status}`, 500);
      }

      // Convert XML to JSON
      const xml = response.data;
      const apiResponse = xmlToJson(xml);

      // Parse the deeply nested response
      const nestedResult = apiResponse.WAJAX.RESULTAT[0];
      const parsedResult = JSON.parse(nestedResult); // Parse the JSON string
      const colisArray = parsedResult.Colis;

      if (!Array.isArray(colisArray) || colisArray.length === 0) {
          throw new ErrorHandler('No colis found in the API response.', 400);
      }


      // Update orders and products based on the parsed Colis array
      const updatePromises = colisArray.map(async (colis) => {
          const order = await Order.findOneAndUpdate(
              { nbr_order: colis.id_Externe },
              {
                  $set: {
                      status_livraison: 'En Préparation',
                      tracking_number: colis.Tracking,
                  },
              }
          );

          if (!order) {
              console.warn(`Order with nbr_order ${colis.id_Externe} not found.`);
              return;
          }

          // Decrease product quantity
          await Product.updateOne(
              { _id: order.product },
              { $inc: { quantity: -order.quantity, quantity_out: order.quantity } }
          );
      });

      await Promise.all(updatePromises);

      res.status(200).json({
          success: true,
          message: 'Orders successfully added to delivery.',
      });
  } catch (error) {
      console.error('Error during delivery process:', error.message);
      return next(new ErrorHandler(error.message || 'Error processing delivery request.', 500));
  }
});



  
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
          if (order.confirmatrice) {
            const user = await User.findById(order.confirmatrice);
            if (user) {
              await User.findByIdAndUpdate(
                order.confirmatrice,
                {
                  $inc: {
                    pendingAmount: user.orderConfirmedPrice, // Increment the pendingAmount by orderConfirmedPrice
                  },
                },
                { new: true }
              );
            }
          }
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