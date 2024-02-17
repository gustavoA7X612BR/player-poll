const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () =>
  console.log('DATABASE: succesfully connected')
);
mongoose.connection.on('error', () => console.log('DATABASE: connection error'));

module.exports = mongoose;
