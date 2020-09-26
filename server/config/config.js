// ======================
// PUERTO   =============
// ======================
process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Database
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://TheThian:dfolIvnL35K0w00a@cluster0.v8iug.mongodb.net/cafe';
}

// Crear variables de enterno
process.env.URLDB = urlDB;