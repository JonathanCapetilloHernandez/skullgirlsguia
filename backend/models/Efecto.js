const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const efectoSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagenUrl: { type: String, required: true },
    esPositivo: { type: Boolean, required: true } // true para positivo, false para negativo
});

module.exports = mongoose.model('Efecto', efectoSchema);