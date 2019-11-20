// Este archivo es el encargado de comprobar si el usuario se ha autenticado

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//====================================================================================================================
// VERIFICAR TOKEN
//====================================================================================================================

// Otra forma de hacer un export
exports.verificaToken = function(req, res, next) {

    // Para poder recibir el token en la url
    var token = req.query.token;

    // Verificar validez del token
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // Hacer disponible la información del usuario en cualquier petición
        req.usuario = decoded.usuario;

        next(); // Sirve para indicar que si no se devuelve un error se puedan seguir utilizando las peticiones de abajo
    })

}