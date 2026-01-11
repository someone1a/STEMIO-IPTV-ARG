// Bootstrap mínimo: carga el servidor modular desde src/
require('dotenv').config();

// Arranca el servicio principal (src/server.js) que registra el addon y expone endpoints
require('./src/server');

// Export para testing o uso avanzado
module.exports = {};
