const express = require('express');
let { validaToken, validaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// Listar productos | ALL | populate 'user' & categoria | Limit
app.get('/producto', validaToken, (req, res) => {

    let desde = Number(req.query.from) || 0;
    let hasta = Number(req.query.to) || 5;
    let limite = Number(req.query.limit) || 100;

    Producto.find({ disponible: true })
        .skip(desde) // desde
        .limit(limite) // limitar de 5 en 5
        .populate('categoria', '_id nombre')
        .populate('usuario', '_id nombre email')
        .exec((err, productos) => {

            if (err) { return res.json({ ok: false, err }); };

            if (!productos) { return res.json({ ok: false, err: { message: 'No hay productos disponibles.' } }); }

            Producto.countDocuments({ disponible: true }, (err, cant) => {

                if (err) { return res.json({ ok: false, err }); }

                res.json({ ok: true, count: cant, productos });
            });
        });
});

// Obtener producto por id
app.get('/producto/:id', validaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuarios')
        .populate('categorias')
        .exec((err, productoBD) => {

            if (err) { return res.json({ ok: false, err }); };

            if (!productoBD) {
                return res.json({
                    ok: false,
                    err: { message: 'El producto no fue encontrado' }
                });
            };

            res.json({
                ok: true,
                producto: productoBD
            });

        });
});

app.get('/producto/buscar/:termino', validaToken, (req, res) => {

    let termino = req.params.termino;

    // expresión regular
    let regex = new RegExp(termino, 'i');

    // busqueda
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) { return res.json({ ok: false, err }); };

            res.json({
                ok: true,
                productos
            })
        });
});

// crear un producto
app.post('/producto', validaToken, (req, res) => {
    let body = req.body;
    let usuario_id = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: usuario_id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            message: `Producto ${ producto.nombre } registrado con éxito`,
            producto: productoBD
        });
    });
});

// actualizar producto
app.put('/producto/:id', validaToken, (req, res) => {

    let datosIn = {
        id: req.params.id,
        body: req.body,
        iduser: req.usuario._id
    };

    let datosMod = {
        //nombre: datosIn.nombre,
        precioUni: datosIn.body.precio,
        descripcion: datosIn.body.descripcion,
        disponible: datosIn.body.disponible || true,
        categoria: datosIn.body.categoria,
        usuario: datosIn.iduser
    };

    Producto.findOneAndUpdate(datosIn.id, datosMod, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No se encontro el producto para actualizar' }
            });
        };

        res.json({
            ok: true,
            message: `Producto [${ productoBD.nombre }] actualizado con éxito`,
            producto: productoBD
        });
    });
});

// delete producto | Disponible a false
app.delete('/producto/:id', validaToken, (req, res) => {
    let datosIn = {
        id: req.params.id,
        iduser: req.usuario._id
    };

    let datosMod = {
        disponible: false,
        usuario: datosIn.iduser
    };

    Producto.findOneAndUpdate(datosIn.id, datosMod, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No se encontro el producto para eliminar' }
            });
        };

        res.json({
            ok: true,
            message: `Producto [${ productoBD.nombre }] eliminado con éxito`,
            producto: productoBD
        });
    });
});

module.exports = app;