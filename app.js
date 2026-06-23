const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Conectar a MongoDB
conectarDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡API funcionando!' });
});

module.exports = app;