const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comboSchema = new Schema({
    personaje: { type: String, required: true },
    descripcion: { type: String, required: true },
    videoUrl: { type: String, required: true },
    noRecomendable: { type: String, required: true }
});

module.exports = mongoose.model('Combo', comboSchema);