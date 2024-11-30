const cron = require('node-cron');
const Order = require('../models/orderModel'); // Import Order model
const { fetchTrackingDetails } = require('../controllers/DelivryController'); // Import tracking API function

const finalStatuses = ['Livrée', 'Retour', 'Supprimee'];
const batchSize = 10; // Define the batch size

// Function to process batches of orders
const processOrderBatches = async (batchSize) => {
  let skip = 0;
  let hasMoreOrders = true;

  while (hasMoreOrders) {
    // Fetch a batch of orders
    const ordersInProcessing = await Order.find({
      status_livraison: { $ne: null, $nin: finalStatuses },
      status: 'confirmed',
    })
      .skip(skip)
      .limit(batchSize);
    // Check if there are more orders
    hasMoreOrders = ordersInProcessing.length === batchSize;
    skip += batchSize;

    // Extract tracking numbers from the orders
    const trackingNumbers = ordersInProcessing.map(order => order.tracking_number);

    // Process tracking numbers in batches
    if (trackingNumbers.length > 0) {
      await batchRequests(trackingNumbers, batchSize);
    }
  }
};

// Function to batch API requests
const batchRequests = async (trackingNumbers, batchSize = 10) => {
  const batches = [];
  for (let i = 0; i < trackingNumbers.length; i += batchSize) {
    batches.push(trackingNumbers.slice(i, i + batchSize));
  }
  for (const batch of batches) {
    const formattedBatch = batch.map(trackingNumber => ({
      Tracking: trackingNumber,
    }));
    await fetchTrackingDetails(formattedBatch);
  }
};

// Cron job to process orders
cron.schedule('*/1 * * * *', async () => { // Poll every minute
  try {
    await processOrderBatches(batchSize);
  } catch (error) {
    console.error('Error processing orders:', error);
  }
});
