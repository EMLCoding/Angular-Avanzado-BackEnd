# Angular-Avanzado-BackEnd
BackEnd curso Angular avanzado - Hecho con Node JS y Mongo DB

# NODE JS

Para crear un proyecto BackEnd de Node lo primero que hay que hacer es crearse una carpeta donde guardar el proyecto y viajar hasta ella en la terminal.
Luego utilizar el comando: sudo ‘npm init’ . Ir presionando enter para aceptar los nombres y datos que va mostrando.

Una vez creado hay que utilizar el comando sudo ‘npm install express --save’

Después abrir el proyecto en visual studio y generar el archivo app.json

Lo básico que debe tener el archivo es lo siguiente:
// Requires - Importación de Librerias que se necesitan para que funcionen X cosas
var express = require('express'); // Librería de express

// Inicializar variables - Donde se utilizan las liberias
var app = express();

// Escuchar peticiones / Escuchar el express. Se pone el puerto y si se quiere un mensaje con las funciones de flecha
app.listen(8080, () => {
    console.log('Express server puerto 8080: \x1b[32m%s\x1b[0m', 'online'); // '\x1b[32m%s\x1b[0m' muestra el mensaje 'online' en verde
});

Para levantar el servidor hay que utilizar el comando ‘nodo app’

Nota: Los colores que se pueden utilizar en la consola son los siguiente:
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"
FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

Ejemplo:
console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online'); 

IMPORTANTE: Para no tener que bajar y subir el servidor para comprobar los cambios realizados en el código se puede utilizar el siguiente comando (en la terminal en el proyecto backend): ‘npm install --save-dev nodemon’
Luego en el archivo package.json poner lo siguiente dentro de los scripts:
"start": "nodemon app.js",

A partir de ahora hay que lanzar la app con npm Start

# CONEXION MONGO DB
Para establecer la conexión con Mongo DB primero hay que instalarlo siguiendo el siguiente manual: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
Luego cada vez que se quiera utilizar hay que levantar el servidor usando ‘sudo Mongo’ y ya se podrá acceder a la base de datos con Robo 3T


# INSTALAR MONGOOSE (Librería que permite controlar mejor la BBDD desde el visual studio)
https://mongoosejs.com/docs/index.html

Luego hay que añadir la librería en app.js (visual studio): 
// Requires
var mongoles = require(‘mongoles’);
// Conexión BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err; 
    console.log('MongoDB: \x1b[32m%s\x1b[0m', 'online');
})

# Peticiones a BBDD
Para facilitar la creación de una petición POST a la BBDD se va a utilizar la librería "body parser": https://www.npmjs.com/package/body-parser

# Mejora para el control de los validadores al hacer peticiones POST a la BBDD
Instalar lo siguiente en el proyecto: npm install mongoose-unique-validator --save
Luego en el archivo que queramos de la carpeta "models" hay que utilizar la siguiente línea: var uniqueValidator = require('mongoose-unique-validator'); 
Y debajo de la creación del esquema poner lo siguiente: usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });

# Encriptaciones de contraseñas en la BBDD
Se puede utilizar una librería para hacer encriptación de una sola vía. https://github.com/dcodeIO/bcrypt.js/blob/master/README.md

# Login + Creación de un token
Para manejar la creación de un token se va a utilizar la librería jsonwebtoken: https://github.com/auth0/node-jsonwebtoken

La generación de un token en el archivo /routes/login.js

Para comprender el token generado se utiliza esta página: https://jwt.io/

# Subida de archivos
Para la subida de archivos se utiliza una librería llamada express-fileupload: https://github.com/richardgirges/express-fileupload

# CORS
Para permitir que se realicen conexiones entre diferentes dominios (vale para 'localhost: X' y 'localhost: Y') hay que configurar las CORS
Ver app.js
