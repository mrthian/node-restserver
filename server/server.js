require('./config/config');

const express = require('express');
const mongoose = require('mongoose'); // conexión a mongo d

const app = express();

const bodyParser = require('body-parser'); // para capturar los parametros del header o form tils

// ========================================================
// middleware =============================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// ========================================================

// ==================================
// ROUTES ===========================
app.use(require('./routes/usuario')); // importar rutas de usuarios
// ==================================

/** ficheros de configuración personal */
let port = process.env.PORT;

// API's
app.get('/', function(req, res) {
    res.json('Hola Mundo!!!')
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


app.listen(port, () => console.log(`Escuchando puerto ${ port }`));