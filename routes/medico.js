var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

//==============================================================================================
// OBTENER TODOS LOS MEDICOS
//==============================================================================================

app.get('/', (req, res) => {

    Medico.find({}).populate('usuario', 'name email').populate('hospital').exec(
        (err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los datos de la BBDD',
                    error: err
                })
            }

            res.status(200).json({
                ok: true,
                medicos: medicos
            })
        }
    )
});

//==============================================================================================
// ACTUALIZAR MEDICO
//==============================================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando los datos de la BBDD',
                error: err
            })
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un médico con ese id',
                error: err
            })
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospitalId;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    error: err
                })
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })
        })
    })

});

//==============================================================================================
// CREAR UN NUEVO MEDICO
//==============================================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospitalId
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el nuevo médico',
                error: err
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        })
    })

});

//==============================================================================================
// ELIMINAR USUARIO
//==============================================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el médico',
                error: err
            })
        }

        if (!medicoEliminado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un médico con ese ID',
                error: err
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        })
    })

});

module.exports = app;