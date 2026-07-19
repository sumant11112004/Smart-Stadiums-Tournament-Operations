const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-stadiums';
    console.log(`Connecting to MongoDB at: ${connUri.replace(/:([^@]+)@/, ':****@')}`);
    
    // Disable buffering so queries fail fast if DB is offline, triggering controllers fallback
    mongoose.set('bufferCommands', false);

    // Set Mongoose options
    const options = {
      serverSelectionTimeoutMS: 2000, // Timeout after 2s for testing
    };

    const conn = await mongoose.connect(connUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Warning: Server is running in Fallback/Demo mode. Database persistent features might fail or operate in-memory.');
    return false;
  }
};

module.exports = connectDB;
