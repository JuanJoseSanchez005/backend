const express = require('express');
const router = express.Router();
const { registrar, login, miPerfil } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

// POST - Registrar nuevo usuario
router.post('/register', registrar);

// POST - Iniciar sesión
router.post('/login', login);

// GET - Obtener perfil del usuario autenticado
router.get('/me', proteger, miPerfil);

module.exports = router;
