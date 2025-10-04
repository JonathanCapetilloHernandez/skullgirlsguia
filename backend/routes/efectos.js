const express = require('express');
const router = express.Router();
const Efecto = require('../models/Efecto');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../img'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Obtener efectos positivos (público)
router.get('/positivos', async (req, res) => {
    try {
        const efectos = await Efecto.find({ esPositivo: true });
        res.json(efectos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener efectos negativos (público)
router.get('/negativos', async (req, res) => {
    try {
        const efectos = await Efecto.find({ esPositivo: false });
        res.json(efectos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Añadir un nuevo efecto
router.post('/', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen.');
    }

    const { nombre, descripcion, esPositivo } = req.body;

    const efecto = new Efecto({
        nombre,
        descripcion,
        esPositivo: esPositivo === 'true',
        imagenUrl: `img/${req.file.filename}`
    });

    try {
        const newEfecto = await efecto.save();
        res.status(201).json(newEfecto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;