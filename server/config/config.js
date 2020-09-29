// ======================
// PUERTO   =============
// ======================
process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

// ======================
// SEED de authenticate
// ======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ======================
// Database
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// Crear variables de enterno
process.env.URLDB = urlDB;

// ============================
// Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '94537052490-gm7kes9ghfhhfd5k4r6km5ru95n51qd5.apps.googleusercontent.com';