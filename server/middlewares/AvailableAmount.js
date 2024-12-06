const cron = require('node-cron');
const User = require('../models/userModel');

// Schedule job to run at midnight on the 1st of every month
cron.schedule('0 0 1 * *', async () => { 

  try {
    await User.updateMany(
        {},
        [
          {
            $set: {
              availableAmount: { $add: [{ $toDouble: "$availableAmount" },
                                { $toDouble: "$pendingAmount" }] }, // Cast to numbers
              pendingAmount: 0,
            }
          }
        ]
      );
  } catch (error) {
    console.error('Error during monthly reset:', error);
  }
});
