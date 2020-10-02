const express = require('express');
const fs = require('fs');
const path = require('path');

const { validaTokenImg } = require('../middlewares/autenticacion')

const app = express();

app.get('/imagen/:tipo/:img', validaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImage); // lee el contect-type del fichero
    }

});

module.exports = app;