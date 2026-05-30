const mongoose = require('mongoose');

const MAX_RETRIES = 3;
let retryCount = 0;

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
  retryCount = 0;
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
    });
    return conn;
  } catch (error) {
    retryCount++;
    console.error(`MongoDB connection attempt ${retryCount} failed: ${error.message}`);

    if (error.name === 'MongooseServerSelectionError') {
      console.error('Cannot reach MongoDB Atlas. Check network access IP whitelist.');
    }

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in 5 seconds... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return connectDB();
    }

    console.error('All MongoDB connection retries exhausted. Exiting.');
    process.exit(1);
  }
};

module.exports = connectDB;
