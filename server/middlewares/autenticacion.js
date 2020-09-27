const jwt = require('jsonwebtoken');
require('../config/config');

// =====================================
// Verificar Token
// =====================================

// next es para continuar con la ejecución
let validaToken = (req, res, next) => {

    // capturar los header de la petición
    //let token = req.get('Authorization');
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            res.status(401)
                .json({ ok: false, err: { message: 'Token no valido' } });
        }

        // validar el decode
        req.usuario = decoded.usuario;
        next(); // para continuar con la ejecución si todo sale bien
    });
};

// =====================================
// Verificar Token
// =====================================
let validaAdminRole = (req, res, next) => {
    // Este usuario se obtiene de la validación anteriór del token
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El role de usuario no esta autorizado para crear' }
        });
    }
};

module.exports = { validaToken, validaAdminRole };