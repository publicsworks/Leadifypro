const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error details:', error);
        // process.exit(1); // Keep server running to see logs
    }
};

module.exports = connectDB;
