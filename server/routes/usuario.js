const express = require('express');
const app = express();

// encrypt password
const bcrypt = require('bcrypt');

const _ = require('underscore');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// Importar el usuario
const Usuario = require('../models/usuario');

// ||--> Solicitar datos
app.get('/usuario', function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // desde
        .limit(limite) // limitar de 5 en 5
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Contar registros en la bd
            Usuario.count({ estado: true }, (err, conteo) => {
                // retornar mensaje al usuarios
                res.json({
                    ok: true,
                    count: conteo,
                    usuarios
                });
            });
        });
});

// ||--> Crear nuevo registros
app.post('/usuario', function(req, res) {

    let body = req.body;

    // INSERTAR USUARIOS | Crear una nueva instancia con el mongoose 
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        //img: body.img,
        role: body.role
    });

    // Guardar usuario en mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
        res.json({ ok: true, usuario: usuarioDB });
    });
});

// || --> Actualizar datos
app.put('/usuario/:id', function(req, res) {

    // Capturar los body y filtrar los campos configurables
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // Capturar parametros por url
    let id = req.params.id;

    // borrar propiedades no actualizables 
    //delete res.body.password;
    //delete res.body.google;

    // Buscar y actualizar
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) { return res.status(400).json({ ok: false, err }); }

        res.json({ ok: true, usuarioDB });
    });
    //Usuario.findById(id, (err, usuarioDB) => {});
});

// || --> Borrar registros
app.delete('/usuario/:id', function(req, res) {
    // Capturar parametros por url
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }


    // Buscar y actualizar
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioDB) => {
        if (err) { return res.status(400).json({ ok: false, err }); }

        res.json({
            ok: true,
            message: 'Usuario eliminado con éxito',
            usuarioDB
        });
    });

    /**
    // Eliminar fisicamente el documento de la coleción
    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({ ok: false, err: { menssage: 'Usuario no encontrado' } })
        }

        res.json({ ok: true, usuario: usuarioDB });
    });*/
});

module.exports = app;