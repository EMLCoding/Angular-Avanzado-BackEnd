var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    // Schema.Types.ObjectId indica que este campo usuario es una referencia a la tabla Usuario. Guarda el usuario._id
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });


module.exports = mongoose.model('Hospital', hospitalSchema);