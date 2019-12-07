var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

//==============================================================================================
// OBTENER TODOS LOS HOSPITALES
//==============================================================================================

app.get('/', (req, res) => {

    // Con .populate se puede buscar una tabla y mostrar X datos de esa tabla en función del id que saque mi petición.
    // Es decir, este Hospital.find devuelve el id de un usuario. Si usamos .populate('usuario') busca automáticamente ese ID y muestra dicho usuario,¡. 
    //Si añadimos ",(nombre email)" indicamos que solo se van a mostrar esos dos campos de la tabla 'usuario'
    Hospital.find({}).populate('usuario', 'nombre email').exec(
        (err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando los datos de la BBDD',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospitales: hospitales
            })
        }
    )

});

//==============================================================================================
// OBTENER HOSPITAL POR ID
//==============================================================================================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Hospital.findById(id).populate('usuario', 'nombre img email').exec((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospital
        });
    })
})

//==============================================================================================
// ACTUALIZAR HOSPITAL
//==============================================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID'
            })
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Erro al actualizar el hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            })
        })
    })
})

//==============================================================================================
// CREAR UN NUEVO HOSPITAL
//==============================================================================================

// Se utiliza 'mdAutenticacion.verificaToken' para que comprueba si el usuario tiene un token valido y así podrá hacer la petición
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            })
        }

        return res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        })
    })
});

//==============================================================================================
// ELIMINAR HOSPITAL
//==============================================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            })
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                idBuscado: id
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Hospital borrado correctamente',
            hospital: hospitalBorrado
        })

    })
})

module.exports = app;