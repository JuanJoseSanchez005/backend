const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función auxiliar: generar un token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },   // payload
    process.env.JWT_SECRET,                   // clave secreta
    { expiresIn: process.env.JWT_EXPIRES_IN } // expiración
  );
};

// POST /api/auth/register
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password, edad, ciudad, telefono, rol } = req.body;

    // 1. Validar que vengan los datos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({
        exitoso: false,
        mensaje: 'Nombre, email y contraseña son requeridos'
      });
    }

    // 2. Verificar si el email ya está registrado
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        exitoso: false,
        mensaje: 'Este email ya está registrado'
      });
    }

    // 3. Crear el usuario (el hook cifra la contraseña solo)
    const usuario = await User.create({
      nombre,
      email,
      password,
      edad,
      ciudad,
      telefono,
      rol
    });

    // 4. Generar token para que entre directo sin re-login
    const token = generarToken(usuario);

    // 5. Responder (sin enviar la contraseña)
    res.status(201).json({
      exitoso: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar datos
    if (!email || !password) {
      return res.status(400).json({
        exitoso: false,
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    // 2. Buscar el usuario INCLUYENDO el password
    //    (recuerda que pusimos select: false en el modelo)
    const usuario = await User.findOne({ email }).select('+password');

    // 3. Si no existe, error genérico (no revelar qué falló)
    if (!usuario) {
      return res.status(401).json({
        exitoso: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // 4. Comparar la contraseña con el método del modelo
    const passwordCorrecta = await usuario.compararPassword(password);
    if (!passwordCorrecta) {
      return res.status(401).json({
        exitoso: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // 5. Todo bien: generar token
    const token = generarToken(usuario);

    // 6. Responder con el token
    res.status(200).json({
      exitoso: true,
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// GET /api/auth/me (ruta protegida)
exports.miPerfil = async (req, res) => {
  // req.usuario lo puso el middleware 'proteger'
  res.status(200).json({
    exitoso: true,
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      rol: req.usuario.rol,
      edad: req.usuario.edad,
      ciudad: req.usuario.ciudad,
      telefono: req.usuario.telefono,
      activo: req.usuario.activo
    }
  });
};
