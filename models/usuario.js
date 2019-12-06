var mongoose = require('mongoose'); // Importa la libería de mongoose
var uniqueValidator = require('mongoose-unique-validator'); // Librería para controlar los validadores de campos con "unique" al hacer peticiones POST

var Schema = mongoose.Schema; // Función que permite definir esquemas/tablas para la BBDD

// Permite controlar los roles permitidos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

// Se crea el objeto tal y como se ha creado en Mongo DB (Robo 3T)
var usuarioSchema = new Schema({
    // nombre campo, tipo de variable, ¿obligatorio?, mensaje que aparece si no se ha introducido un valor para ese campo
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    // unique: true para indicar que no puede haber dos email iguales
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatorio'] },
    img: { type: String },
    // default permite añadir un valor por defecto en caso de que no se introduzca nada
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
});

// Crea el mensaje que se va a mostrar si no se cumple la condición de único. {PATH} = nombre del campo que no cumple con la condición "unique"
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });

// Para poder utilizar el objeto fuera de este archivo
module.exports = mongoose.model('usuario', usuarioSchema);