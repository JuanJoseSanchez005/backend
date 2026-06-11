const User = require('../models/User');

// GET - Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    // Consulta a MongoDB
    const usuarios = await User.find();
    
    res.status(200).json({
      exitoso: true,
      cantidad: usuarios.length,
      datos: usuarios
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// GET - Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await User.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      datos: usuario
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// POST - Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, edad, ciudad, rol } = req.body;
    
    // Crear nuevo documento
    const nuevoUsuario = new User({
      nombre,
      email,
      edad,
      ciudad,
      rol
    });
    
    // Guardar en MongoDB
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json({
      exitoso: true,
      mensaje: 'Usuario creado exitosamente',
      datos: usuarioGuardado
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al crear usuario',
      error: error.message
    });
  }
};

// PUT - Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    
    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Usuario actualizado',
      datos: usuarioActualizado
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// DELETE - Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuarioEliminado = await User.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Usuario eliminado',
      datos: usuarioEliminado
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al eliminar usuario',
      error: error.message
    });
  }
};