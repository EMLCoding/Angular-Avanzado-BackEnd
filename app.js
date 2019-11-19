// Requires - Importación de Librerias que se necesitan para que funcionen X cosas
var express = require('express'); // Librería de express
var mongoose = require('mongoose'); // Librería que permite controlar mejor la BBDD de Mongo

// Inicializar variables - Donde se utilizan las liberias
var app = express();

// Conexión BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err; // Si la conexión devuelve un error lanza un throw y ya no hace nada más, ni el console.log ni nada de esta conexión

    console.log('MongoDB: \x1b[32m%s\x1b[0m', 'online');
})

// Rutas. 'Res' es la respuesta que va a enviar el servidor
app.get('/', (req, res, next) => {
    // 200 es uno de los códigos http -> Devuelve un OK
    res.status(200).json({
        // cuerpo de la respuesta
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones / Escuchar el express. Se pone el puerto y si se quiere un mensaje con las funciones de flecha
app.listen(8080, () => {
    console.log('Express server puerto 8080: \x1b[32m%s\x1b[0m', 'online'); // '\x1b[32m%s\x1b[0m' muestra el mensaje 'online' en verde
});