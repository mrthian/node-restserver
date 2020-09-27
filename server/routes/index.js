const express = require('express');
const app = express();

app.use(require('./usuario')); // importar rutas de usuarios
app.use(require('./login')); // importar rutas de login

module.exports = app;