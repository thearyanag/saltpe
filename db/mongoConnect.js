const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saltpe';
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
        console.log('Mongoose is connected!');
    });
}

module.exports = mongoConnect;