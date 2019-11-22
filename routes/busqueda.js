var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario')

//==============================================================================================
// BUSQUEDA POR TABLA
//==============================================================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;

    var expresionRegular = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expresionRegular)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, expresionRegular)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, expresionRegular)
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe esa tabla',
                error: err
            })
    }

    promesa.then(datos => {
        res.status(200).json({
            ok: true,
            [tabla]: datos
        })
    })

})

//==============================================================================================
// BUSQUEDA GENÉRICA
//==============================================================================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda; // Viaja siempre en la ruta, por eso 'params' y no 'query'
    var expresionRegular = new RegExp(busqueda, 'i'); // Para que la busqueda no distinga entre mayus y minusculas


    // 'all' permite enviar un array de promesas y cuando todas se cumplan devuelve el resolve, sino reject
    Promise.all([
        buscarHospitales(busqueda, expresionRegular),
        buscarMedicos(busqueda, expresionRegular),
        buscarUsuarios(busqueda, expresionRegular)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    })

});

function buscarHospitales(busqueda, expresionRegular) {

    // Crear una nueva promesa
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: expresionRegular }).populate('usuario', 'nombre email').exec((err, hospitales) => {

            if (err) {
                reject('Error al buscar hospitales', err);
            } else {
                resolve(hospitales);
            }
        })
    })
}

function buscarMedicos(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: expresionRegular }, (err, medicos) => {

            if (err) {
                reject('Error al buscar medicos', err);
            } else {
                resolve(medicos);
            }
        })
    })
}

function buscarUsuarios(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {
        // Con el 'or' permite buscar en varias columnas de la tabla Usuario
        Usuario.find({}, 'nombre email role').or([{ nombre: expresionRegular }, { email: expresionRegular }]).exec((err, usuarios) => {

            if (err) {
                reject('Error al buscar usuarios', err);
            } else {
                resolve(usuarios);
            }
        })
    })
}

module.exports = app;