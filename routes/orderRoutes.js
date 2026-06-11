const express = require('express');
const router = express.Router();
const {
  obtenerOrdenes,
  obtenerOrdenPorId,
  crearOrden,
  actualizarOrden,
  eliminarOrden
} = require('../controllers/orderController');

// GET - Obtener todas las órdenes
router.get('/', obtenerOrdenes);

// GET - Obtener una orden por ID
router.get('/:id', obtenerOrdenPorId);

// POST - Crear una nueva orden
router.post('/', crearOrden);

// PUT - Actualizar una orden
router.put('/:id', actualizarOrden);

// DELETE - Eliminar una orden
router.delete('/:id', eliminarOrden);

module.exports = router;
