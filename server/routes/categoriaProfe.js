const express = require('express');
let { validaToken, validaAdminRole } = require('../middlewares/autenticacion');

let app = express();

// Importar el modelo
let Categoria = require('../models/categoria');

// Consultar listado de categorias
app.get('/categoria', validaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', '_id email') // validar que objectId existen
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                categorias
            });
        });
});

// MOSTRAR LA CATEGORIA POR ID
app.get('/categoria/:id', validaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// crear una nueva categoria
// @return Categoria
app.post('/categoria', validaToken, (req, res) => {
    //res.send('POST: /categoria');

    let body = req.body;
    let categoria = new Categoria({
        codigo: body.codigo,
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', validaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let nombreCategoria = { nombre: req.body.nombre };

    Categoria.findByIdAndUpdate(id, nombreCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.delete('/categoria/:id', [validaToken, validaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El id no existe' }
            });
        };

        res.json({
            ok: true,
            message: 'Categoria borrada con éxito',
            categoria: categoriaDB
        });

    });
});

module.exports = app;