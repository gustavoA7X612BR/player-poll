const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () =>
  console.log('conectado com sucesso!')
);
mongoose.connection.on('error', () => console.log('conexão falhou!'));

module.exports = mongoose;
