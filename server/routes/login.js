const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

// Libreria de google
const { OAuth2Client } = require('google-auth-library'); // IMPORT
const usuario = require('../models/usuario');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();


app.post('/login', (req, res) => {

    // capturar body | header
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500)
                .json({ ok: false, err });
        }

        if (!usuarioDB) {
            return res.status(400)
                .json({ ok: false, err: { message: '(Usuario) o contraseña incorrectos' } });
        }

        // Evaluar la clave
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400)
                .json({ ok: false, err: { message: 'Usuario o (contraseña) incorrectos' } });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({ ok: true, usuario: usuarioDB, token });

    });
});

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload(); // obtiene toda la información del usuario

    return {
        nombre: payload.name,
        img: payload.picture,
        google: true,
        email: payload.email
    }

    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
//verify().catch(console.error);

app.post('/google', async(req, res) => {
    // Retornar el token de google
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403)
                .json({
                    ok: false,
                    err
                });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        };

        if (usuarioDB) {
            /**
             * Validar si el usuario existe
             */
            if (usuarioDB.google === false) {
                return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'Debe utilizar su autenticación normal'
                        }
                    });
            } else {
                // retornar mi token de autenticación
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                res.json({ ok: true, usuario: usuarioDB, token });
            }
        } else {
            // crear usuario si no existe en la BD
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'

            // gravar usuario
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500)
                        .json({ ok: false, err });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                res.json({ ok: true, usuario: usuarioDB, token });
            });
        };

    });

    //res.json({
    //    googleUser
    //});
});

module.exports = app;