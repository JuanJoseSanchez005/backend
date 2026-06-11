const Product = require('../models/Product');

// GET - Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find();
    
    res.status(200).json({
      exitoso: true,
      cantidad: productos.length,
      datos: productos
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
};

// GET - Obtener productos por categoría
exports.obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    const productos = await Product.find({ categoria: categoria });
    
    res.status(200).json({
      exitoso: true,
      cantidad: productos.length,
      datos: productos
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
};

// GET - Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Product.findById(id);
    
    if (!producto) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      datos: producto
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener producto',
      error: error.message
    });
  }
};

// POST - Crear un nuevo producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad, categoria, sku } = req.body;
    
    const nuevoProducto = new Product({
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      sku
    });
    
    const productoGuardado = await nuevoProducto.save();
    
    res.status(201).json({
      exitoso: true,
      mensaje: 'Producto creado exitosamente',
      datos: productoGuardado
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al crear producto',
      error: error.message
    });
  }
};

// PUT - Actualizar un producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    
    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );
    
    if (!productoActualizado) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Producto actualizado',
      datos: productoActualizado
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// DELETE - Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productoEliminado = await Product.findByIdAndDelete(id);
    
    if (!productoEliminado) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Producto eliminado',
      datos: productoEliminado
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
};