// SE CREA UN ARCHIVO DE RUTAS PARA SEGMENTARLO Y QUE NO SE HAGA ENORME EL ARCHIVO app.js PRINCIPAL

var express = require('express');

var app = express();

// Rutas. 'Res' es la respuesta que va a enviar el servidor
app.get('/', (req, res, next) => {
    // 200 es uno de los códigos http -> Devuelve un OK
    res.status(200).json({
        // cuerpo de la respuesta
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

module.exports = app;