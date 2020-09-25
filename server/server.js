require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

/**         middleware                     */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/** ------------------------------------------------ */


/** ficheros de configuración personal */
let port = process.env.PORT;

// API's
app.get('/', function(req, res) {
    res.json('Hola Mundo!!!')
});

// ||--> Solicitar datos
app.get('/usuario', function(req, res) {
    res.json('get Usuario!!!')
});

// ||--> Crear nuevo registros
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es requerido'
        });
    } else {
        res.json({ persona: body });
    }
});

// || --> Actualizar datos
app.put('/usuario/:id', function(req, res) {

    // Capturar parametros
    let id = req.params.id;

    res.json({
        id
    })
});

// || --> Borrar registros
app.delete('/usuario', function(req, res) { res.json('DELETE usuarios!!') });



app.listen(port, () => console.log(`Escuchando puerto ${ port }`));