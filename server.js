require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const servidor = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  servidor.close(() => process.exit(1));
});