const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables. Please add it to .env')
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error.message)
    process.exit(1)
  }
};

module.exports = connectDB;