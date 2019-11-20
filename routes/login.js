var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); // Para la creación de tokens

// Importa la constante SEED del archivo config.js
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    // Se busca el usuario por el email en la BBDD
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese email',
                errors: err
            })
        }

        // Comprueba la contraseña enviada en la peticion con la contraseña devuelta en el findOne.
        // Si no coincide...
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las credenciales son incorrectas',
                errors: err
            })
        }

        // Si el email y la contraseña son validos se crea un token
        // Parámetros: Primero va el dato. Segundo semilla (tiene que ser algo único que nos inventemos). Tercero la fecha de expiración del token
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // Expira a las 4 horas

        usuarioDB.password = ':)'

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    })


})


module.exports = app;