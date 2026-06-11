const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// GET - Obtener todas las órdenes
exports.obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Order.find()
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio');
    
    res.status(200).json({
      exitoso: true,
      cantidad: ordenes.length,
      datos: ordenes
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener órdenes',
      error: error.message
    });
  }
};

// GET - Obtener una orden por ID
exports.obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Order.findById(id)
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio');
    
    if (!orden) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Orden no encontrada'
      });
    }
    
    res.status(200).json({
      exitoso: true,
      datos: orden
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al obtener orden',
      error: error.message
    });
  }
};

// POST - Crear una nueva orden
exports.crearOrden = async (req, res) => {
  try {
    const { usuario, productos, estado } = req.body;
    
    // 1. Validar que el usuario exista
    const usuarioExiste = await User.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // 2. Validar que la orden tenga productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        exitoso: false,
        mensaje: 'La orden debe contener al menos un producto'
      });
    }
    
    let totalCalculado = 0;
    const productosParaActualizarStock = [];
    
    // 3. Validar existencia de cada producto y disponibilidad de stock
    for (const item of productos) {
      const productoDb = await Product.findById(item.producto);
      if (!productoDb) {
        return res.status(404).json({
          exitoso: false,
          mensaje: `Producto con ID ${item.producto} no encontrado`
        });
      }
      
      if (productoDb.cantidad < item.cantidad) {
        return res.status(400).json({
          exitoso: false,
          mensaje: `Stock insuficiente para el producto "${productoDb.nombre}". Disponible: ${productoDb.cantidad}, Solicitado: ${item.cantidad}`
        });
      }
      
      // Calcular subtotal acumulado
      totalCalculado += productoDb.precio * item.cantidad;
      
      // Guardar información del producto para actualizar stock si todo es válido
      productosParaActualizarStock.push({
        producto: productoDb,
        cantidadComprada: item.cantidad
      });
    }
    
    // 4. Crear y guardar la nueva orden con el total calculado
    const nuevaOrden = new Order({
      usuario,
      productos,
      total: totalCalculado,
      estado
    });
    
    const ordenGuardada = await nuevaOrden.save();
    
    // 5. Descontar stock de los productos comprados
    for (const item of productosParaActualizarStock) {
      item.producto.cantidad -= item.cantidadComprada;
      // Si el stock llega a 0, marcar como no disponible
      if (item.producto.cantidad === 0) {
        item.producto.disponible = false;
      }
      await item.producto.save();
    }
    
    res.status(201).json({
      exitoso: true,
      mensaje: 'Orden creada exitosamente',
      datos: ordenGuardada
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al crear orden',
      error: error.message
    });
  }
};

// PUT - Actualizar una orden
exports.actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    
    const ordenOriginal = await Order.findById(id);
    if (!ordenOriginal) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Orden no encontrada'
      });
    }
    
    // Si la orden pasa a estado "cancelado" y antes no lo estaba, devolvemos el stock a los productos
    if (datosActualizados.estado === 'cancelado' && ordenOriginal.estado !== 'cancelado') {
      for (const item of ordenOriginal.productos) {
        await Product.findByIdAndUpdate(item.producto, {
          $inc: { cantidad: item.cantidad },
          $set: { disponible: true }
        });
      }
    }
    
    const ordenActualizada = await Order.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Orden actualizada',
      datos: ordenActualizada
    });
  } catch (error) {
    res.status(400).json({
      exitoso: false,
      mensaje: 'Error al actualizar orden',
      error: error.message
    });
  }
};

// DELETE - Eliminar una orden
exports.eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orden = await Order.findById(id);
    if (!orden) {
      return res.status(404).json({
        exitoso: false,
        mensaje: 'Orden no encontrada'
      });
    }
    
    // Si la orden no estaba cancelada al momento de eliminarla, devolvemos el stock
    if (orden.estado !== 'cancelado') {
      for (const item of orden.productos) {
        await Product.findByIdAndUpdate(item.producto, {
          $inc: { cantidad: item.cantidad },
          $set: { disponible: true }
        });
      }
    }
    
    await Order.findByIdAndDelete(id);
    
    res.status(200).json({
      exitoso: true,
      mensaje: 'Orden eliminada y stock devuelto exitosamente',
      datos: orden
    });
  } catch (error) {
    res.status(500).json({
      exitoso: false,
      mensaje: 'Error al eliminar orden',
      error: error.message
    });
  }
};
