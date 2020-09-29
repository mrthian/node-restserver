const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Definir el esquema
let Schema = mongoose.Schema;

// definir modelo de la categoria
let categoriaSchema = new Schema({
    codigo: { type: String, required: [true, 'El código de la categoria no puede ser vacio'], unique: true },
    nombre: { type: String, required: [true, 'El nombre de la categoria es requerido'] },
    activo: { type: Boolean, default: true },
    estado: { type: Boolean, default: true },
    //idUser: { type: String, required: [true, 'El id del usuario es requerido'] }
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

// Transformar el mensaje de respuestas
// NA

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);