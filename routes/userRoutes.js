const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userController');
const { proteger, autorizar } = require('../middleware/auth');

// GET - Obtener todos los usuarios (Pública)
router.get('/', obtenerUsuarios);

// GET - Obtener un usuario por ID (Protegida)
router.get('/:id', proteger, obtenerUsuarioPorId);

// POST - Crear un nuevo usuario (Protegida + Solo Admin)
router.post('/', proteger, autorizar('admin'), crearUsuario);

// PUT - Actualizar un usuario (Protegida)
router.put('/:id', proteger, actualizarUsuario);

// DELETE - Eliminar un usuario (Protegida + Solo Admin)
router.delete('/:id', proteger, autorizar('admin'), eliminarUsuario);

module.exports = router;