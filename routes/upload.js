var express = require('express');

var fileUpload = require('express-fileupload'); // Librería 'express-fileupload' para subir archivos
var fs = require('fs'); // Librería de file System

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            error: err
        })
    }


    // Si no se ha seleccionado ningún archivo....
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            error: err
        })
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var cachosNombre = archivo.name.split('.') // Genera un array de strings con todas las palabras que estén separadas por un punto, dentro del nombre del archivo
    var extensionArchivo = cachosNombre[cachosNombre.length - 1]; // Guarda la ultima palabra separada por un punto, es decir, la extensión del archivo


    // Solo estas extensiones van a ser aceptadas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg', 'heic'];
    // Si la extensión del archivo NO es una de las extensionesPermitidas...
    if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            error: err
        })
    }

    // Crear nombre de archivo personalizado: 1325564342443-12345.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a una carpeta específica
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    })

});

// Va a subir archivos en función si son medicos, hospitales o usuarios y no va a permitir tener dos imagenes iguales por cada id
function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo))  {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al subir archivo',
                        error: err
                    })
                }

                if (!usuario) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No existe un usuario con ese ID',
                        error: err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })
            })

        })
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo))  {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al subir archivo',
                        error: err
                    })
                }

                if (!medico) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No existe un medico con ese ID',
                        error: err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medico: medicoActualizado
                })
            })

        })
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo))  {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al subir archivo',
                        error: err
                    })
                }

                if (!hospital) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No existe un hospital con ese ID',
                        error: err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                })
            })

        })
    }
}

module.exports = app;