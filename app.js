const express = require('express');
const conectarDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Conectar a MongoDB
conectarDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡API funcionando!' });
});

module.exports = app;