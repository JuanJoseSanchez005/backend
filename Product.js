const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  
  descripcion: {
    type: String,
    required: true
  },
  
  precio: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  },
  
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  
  categoria: {
    type: String,
    required: true,
    enum: ['Electrónica', 'Ropa', 'Alimentos', 'Otros']
  },
  
  disponible: {
    type: Boolean,
    default: true
  },
  
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);