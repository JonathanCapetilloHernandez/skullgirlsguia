const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const varianteSchema = new Schema({
    nombre: { type: String, required: true },
    habilidad: { type: String, required: true },
    imagenUrl: { type: String, required: true },
    esBuena: { type: Boolean, required: true } // true para buena, false para mala
});

module.exports = mongoose.model('Variante', varianteSchema);