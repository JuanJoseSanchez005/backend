const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  
  edad: {
    type: Number,
    min: [18, 'Debes ser mayor de 18'],
    max: [120, 'Edad no válida']
  },
  
  ciudad: {
    type: String,
    default: 'No especificada'
  },
  
  telefono: {
    type: String,
    sparse: true
  },
  
  activo: {
    type: Boolean,
    default: true
  },
  
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  
  rol: {
    type: String,
    enum: ['usuario', 'admin', 'moderador'],
    default: 'usuario'
  }
}, { timestamps: true });

// HOOK: se ejecuta ANTES de guardar (pre 'save')
userSchema.pre('save', async function () {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) {
    return;
  }
  // Generar el salt y hashear
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// MÉTODO: comparar contraseña en el login
userSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);