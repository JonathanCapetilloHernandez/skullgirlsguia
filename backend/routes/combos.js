const express = require('express');
const router = express.Router();
const Combo = require('../models/Combo');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../videos'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('El archivo no es un video!'), false);
        }
    }
});

// Obtener todos los combos
router.get('/', async (req, res) => {
    try {
        const combos = await Combo.find();
        res.json(combos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Añadir un nuevo combo
router.post('/', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ningún video.');
    }

    const { personaje, descripcion, noRecomendable } = req.body;

    const combo = new Combo({
        personaje,
        descripcion,
        noRecomendable,
        videoUrl: `videos/${req.file.filename}`
    });

    try {
        const newCombo = await combo.save();
        res.status(201).json(newCombo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;