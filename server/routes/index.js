const express = require('express');
const app = express();

app.use(require('./usuario')); // importar rutas de usuarios
app.use(require('./login')); // importar rutas de login
//app.use(require('./categoria')); // importar rutas de login
app.use(require('./categoriaProfe'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;