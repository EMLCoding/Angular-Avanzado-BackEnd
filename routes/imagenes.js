var express = require('express');

var app = express();

const path = require('path'); //Librería para crear un path
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // Comprobar si existe la imagen, sino muestra una por defecto
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // Si la imagen existe en la ruta...
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage)
    }

});

module.exports = app;