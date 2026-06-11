const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/red_social');
    
    console.log('✅ MongoDB conectada:', conexion.connection.host);
    return conexion;
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;