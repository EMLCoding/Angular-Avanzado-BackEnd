// Requires - Importación de Librerias que se necesitan para que funcionen X cosas
var express = require('express'); // Librería de express
var mongoose = require('mongoose'); // Librería que permite controlar mejor la BBDD de Mongo
var bodyParser = require('body-parser') // Librería que facilita la creación de peticiones POST

// Inicializar variables - Donde se utilizan las liberias
var app = express();

// BODY PARSER - Si el back recibe algún objeto permite transformarlo a un formato facil de utilizar por el back
// Formatos: parse application/x-www-form-urlencoded o application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app'); // Se indica la ruta del archivo que contiene las rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');

// Conexión BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err; // Si la conexión devuelve un error lanza un throw y ya no hace nada más, ni el console.log ni nada de esta conexión

    console.log('MongoDB: \x1b[32m%s\x1b[0m', 'online');
})

// Rutas - Aquí irían los archivos de rutas. Las peticiones se hacen en orden según estén escritas a continuación
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/', appRoutes); // Coge las rutas del archivo routes/app.js

// Escuchar peticiones / Escuchar el express. Se pone el puerto y si se quiere un mensaje con las funciones de flecha
app.listen(8080, () => {
    console.log('Express server puerto 8080: \x1b[32m%s\x1b[0m', 'online'); // '\x1b[32m%s\x1b[0m' muestra el mensaje 'online' en verde
});