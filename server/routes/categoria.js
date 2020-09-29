/**
 * API's de categoria
 */

const express = require('express');
const _ = require('underscore');

let { validaToken, validaAdminRole } = require('../middlewares/autenticacion');

let app = express();

// Importar el modelo
let Categoria = require('../models/categoria');
let Usuario = require('../models/usuario');

// ==========================================================
// API's | Services

// Mostrar todas las categorias 
app.get('/categoria', validaToken, (req, res) => {

    // Consultar categoria
    Categoria.find({ estado: true })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            // Contar la cantidad de registros
            Categoria.countDocuments({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    count: cantidad,
                    categorias
                });
            });
        });
});

// Mostrar categoria por id
app.get('/categoria/:id', validaToken, (req, res) => {
    let id = req.params.id;

    // Buscar usuario
    Categoria.findById(id)
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: { message: 'La categoria no fue encontrada' }
                    });
                }
            } else {

                let usuarioDB = Usuario.findById(categoriaDB.idUser).exec();
                usuarioDB.then(usr => {
                        return res.json({
                            ok: true,
                            categoria: {
                                id: categoriaDB._id,
                                codigo: categoriaDB.codigo,
                                nombre: categoriaDB.nombre,
                                activo: categoriaDB.activo,
                                usuario: {
                                    id: usr._id,
                                    nombre: usr.nombre,
                                    email: usr.email
                                }
                            }
                        });
                    })
                    .catch(err => {
                        return res.json({
                            ok: true,
                            categoria: categoriaDB
                        });
                    });
            };
        });
});

// Crear categoria
app.post('/categoria', [validaToken], (req, res) => {

    let body = req.body;
    let usuario_id = req.usuario._id;

    let categoria = new Categoria({
        codigo: body.codigo,
        nombre: body.nombre,
        idUser: usuario_id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        };
        res.json({ ok: true, categoria: categoriaDB });
    });
});

// Actualizar categoria
app.put('/categoria/:id', (req, res) => {
    let body = _.pick(req.body, ['codigo', 'nombre', 'activo']);

    let id = req.params.id;

    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, message: 'categoria actualizada con éxito', categoriaDB });
    });
});

// BORRAR
app.delete('/categoria/:id', [validaToken, validaAdminRole], (req, res) => {
    let id = req.params.id;

    // Buscar y borrar doumento
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) { return res.status(400).json({ ok: false, err }) };

        res.json({
            ok: true,
            message: 'Categoria eliminada con éxito',
            categoria: categoriaDB
        });
    });
});

module.exports = app;