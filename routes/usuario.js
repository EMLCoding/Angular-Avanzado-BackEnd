var express = require('express');
// Importar librería de encriptación de contraseñas
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); // Para la creación de tokens

// Importa el archivo de autenticaciones
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// Importar esquema de usuario
var Usuario = require('../models/usuario');


//==============================================================================================
// OBTENER TODOS LOS USUARIOS
//==============================================================================================
// Rutas. 'Res' es la respuesta que va a enviar el servidor
app.get('/', (req, res, next) => {
    // Busca en la tabla usuarios de MongoDB. Es como: SELECT * FROM usuarios
    /* Usuario.find({}, (err, usuarios) => {
        // Si se recibe un error...
        if (err) {
            return es.status(500).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'Error cargando usuarios de la BBDD',
                errors: err
            });
        }

        // Si no se devuelve un error...
        res.status(200).json({
            // cuerpo de la respuesta
            ok: true,
            usuarios: usuarios // Devuelve un array de todos los usuarios que haya en la BBDD
        });
    }) */

    // Busca en la tabla usuarios de MongoDB. Es como: SELECT nombre, email, img, role FROM usuarios
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            // Si se recibe un error...
            if (err) {
                return res.status(500).json({
                    // cuerpo de la respuesta
                    ok: false,
                    mensaje: 'Error cargando usuarios de la BBDD',
                    errors: err
                });
            }

            // Si no se devuelve un error...
            res.status(200).json({
                // cuerpo de la respuesta
                ok: true,
                usuarios: usuarios // Devuelve un array de todos los usuarios que haya en la BBDD
            });
        })
});


//==============================================================================================
// ACTUALIZAR USUARIO
//==============================================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    // Coge el id que viaja en la ruta de la petición PUT
    var id = req.params.id;

    // En body se va a guardar el usuario
    var body = req.body;

    // Busca el usuario con el id enviado en la petición
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // Si el usuario no existe...
        if (!usuario) {
            return res.status(400).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'El usuario buscado no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        // Si el usuario existe hace desde aquí hasta el final:

        // va guardando lo que le llega del front o postman en cada variable del objeto usuario
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        // Se va a actualizar el usuario
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    // cuerpo de la respuesta
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            // una forma de que no se muestre por pantalla la contraseña del usuario y se muestre una carita, pero esto no modifica los datos en la BBDD
            usuarioGuardado.password = ':)';

            // Si no da error guarda el usuario guardado
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        })

    });
})

//==============================================================================================
// CREAR UN NUEVO USUARIO
//==============================================================================================

// Se utiliza 'mdAutenticacion.verificaToken' para que comprueba si el usuario tiene un token valido y así podrá hacer la petición
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    // En body se va a guardar lo que enviemos en el cuerpo de la petición
    var body = req.body; // Esto solo funciona por el body-parser

    // Crea un nuevo usuario en función de los datos que llegan junto a la petición POST (desde el front o desde Postman)
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Se encripta la contraseña
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // Guarda el usuario que se recibe en la BBDD
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'Error creando el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            // usuarioToken es el usuario que hace la petición, que viene gracias al decoded del autenticacion.js
            usuarioToken: req.usuario,
        });
    });
});

//==============================================================================================
// ELIMINAR USUARIO
//==============================================================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                // cuerpo de la respuesta
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app;