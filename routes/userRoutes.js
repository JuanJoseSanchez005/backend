const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userController');

// GET - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET - Obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// POST - Crear un nuevo usuario
router.post('/', crearUsuario);

// PUT - Actualizar un usuario
router.put('/:id', actualizarUsuario);

// DELETE - Eliminar un usuario
router.delete('/:id', eliminarUsuario);

module.exports = router;