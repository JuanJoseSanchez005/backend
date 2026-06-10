const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorCategoria
} = require('../controllers/productController');

// GET - Todos los productos
router.get('/', obtenerProductos);

// GET - Productos por categoría
router.get('/categoria/:categoria', obtenerProductosPorCategoria);

// GET - Producto por ID
router.get('/:id', obtenerProductoPorId);

// POST - Crear producto
router.post('/', crearProducto);

// PUT - Actualizar producto
router.put('/:id', actualizarProducto);

// DELETE - Eliminar producto
router.delete('/:id', eliminarProducto);

module.exports = router;