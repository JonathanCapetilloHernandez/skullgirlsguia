const mongoose = require('mongoose');
const Variante = require('./models/Variante');
const Combo = require('./models/Combo');
const Efecto = require('./models/Efecto');

const dbURI = 'mongodb+srv://a23328061310422_db_user:Party4U@skullgirlsdb.ldgqdxi.mongodb.net/';

const seedData = async () => {
    await mongoose.connect(dbURI);
    console.log('Conectado a MongoDB para el seeder.');

    // Limpiar colecciones existentes
    await Variante.deleteMany({});
    await Combo.deleteMany({});
    await Efecto.deleteMany({});
    console.log('Colecciones limpiadas.');

    // --- DATOS DE EJEMPLO ---

    // Variantes Buenas
    await Variante.insertMany([
        { nombre: 'Sobresaliente', habilidad: 'Gana rabia permanente y precisión.', imagenUrl: 'img/veranito.png', esBuena: true },
        { nombre: 'Cazadora de Cabezas', habilidad: 'Los tiros a la cabeza son imbloqueables y causan sangrado.', imagenUrl: 'img/cazadora_cabezas.png', esBuena: true },
    ]);

    // Variantes Malas
    await Variante.insertMany([
        { nombre: 'Gata Negra', habilidad: 'Probabilidad de aturdir al oponente al ser golpeada.', imagenUrl: 'img/gata_negra.png', esBuena: false },
        { nombre: 'In-denegable', habilidad: 'Gana espinas cuando el oponente tiene regeneración.', imagenUrl: 'img/in_denegable.png', esBuena: false },
    ]);

    // Combos
    await Combo.insertMany([
        { personaje: 'Filia', videoUrl: 'videos/filia_combo.mp4', noRecomendable: 'Big Band, Double' },
        { personaje: 'Peacock', videoUrl: 'videos/peacock_combo.mp4', noRecomendable: 'Cerebella' },
    ]);

    // Efectos Positivos
    await Efecto.insertMany([
        { nombre: 'Rabia', descripcion: 'Aumenta el daño infligido.', imagenUrl: 'img/rabia.png', esPositivo: true },
        { nombre: 'Regeneración', descripcion: 'Recupera salud con el tiempo.', imagenUrl: 'img/regeneracion.png', esPositivo: true },
    ]);

    // Efectos Negativos
    await Efecto.insertMany([
        { nombre: 'Sangrado', descripcion: 'Pierde salud con el tiempo.', imagenUrl: 'img/sangrado.png', esPositivo: false },
        { nombre: 'Aturdir', descripcion: 'Incapaz de moverse o atacar.', imagenUrl: 'img/aturdir.png', esPositivo: false },
    ]);

    console.log('Datos de ejemplo insertados.');
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB.');
};

seedData().catch(err => {
    console.error('Error en el seeder:', err);
    mongoose.disconnect();
});
