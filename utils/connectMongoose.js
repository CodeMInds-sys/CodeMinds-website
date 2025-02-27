const mongoose = require('mongoose');
const Logger = require('./logger');

const connectMongoose = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        Logger.info('📦 Connected to MongoDB successfully');
        return connection;
    } catch (error) {
        Logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectMongoose; 