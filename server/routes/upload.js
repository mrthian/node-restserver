const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


let { validaToken, validaAdminRole } = require('../middlewares/autenticacion');

// IMPORTAR MODELOS
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();

// default options | Middleware
app.use(fileUpload({ useTempFiles: true }));
//app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    // obtener parametros
    let tipo = req.params.tipo;
    let id = req.params.id;

    // Validar si contiene fichero
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: true,
            err: {
                message: 'El tipo de carga no es permitida',
                tipo: tiposValidos.join(', ')
            }
        });
    };

    // validar si adjuntaron fichero
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({ ok: false, message: 'No files were uploaded.' });
    };

    // capturar el mensaje que viene de un input de imagen
    let fichero = req.files.archivo;
    let nameFileCut = fichero.name.split('.');
    let extension = nameFileCut[nameFileCut.length - 1];

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500)
            .json({
                ok: true,
                ext: extension,
                err: { message: extensionesValidas.join(', ') }
            });
    };

    let nombreFinal = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // ruta en donde se quiere guardar
    fichero.mv(`uploads/${ tipo }/${ nombreFinal }`, (err) => {

        if (err) {
            return res.status(500)
                .json({ ok: false, err });
        };

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreFinal);
                break;
            case 'productos':
                imagenProducto(id, res, nombreFinal);
                break;
            default:
                res.status().json({ ok: false, err: { message: 'error de tipo' } });
                break;
        };

    });

});

function imagenUsuario(id, res, nombreFichero) {

    // Buscar usuarios
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            deleteFile(nombreFichero, 'usuarios');
            return res.status(500).json({ ok: false, err });
        };

        if (!usuarioDB) {
            deleteFile(nombreFichero, 'usuarios');
            return res.status(400)
                .json({ ok: false, err: { message: `Usuario ${ id } no existe` } });
        };

        deleteFile(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreFichero;
        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                message: 'imagen del usuario actualizada con éxito',
                usuarioDB,
                img: usuarioDB.img
            });
        });
    });
};

function imagenProducto(id, res, nombreFichero) {

    // Buscar producto
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(nombreFichero, 'productos');
            return res.status(500).json({ ok: false, err });
        };

        if (!productoDB) {
            deleteFile(nombreFichero, 'productos');
            return res.status(400)
                .json({ ok: false, err: { message: `Pridto ${ id } no existe` } });
        };

        // borrar imagen anterior si existe 
        deleteFile(productoDB.img, 'productos');

        productoDB.img = nombreFichero;
        productoDB.save((err, productoDB) => {
            res.json({
                ok: true,
                message: 'Imagen del producto cargada con éxito',
                productoDB
            });
        });
    });
};

function deleteFile(nombreFichero, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreFichero }`);
    if (fs.existsSync(pathImage)) {
        let borrado = fs.unlinkSync(pathImage);
        return true;
    };
    return false;
};

module.exports = app;