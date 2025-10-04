const express = require('express');
const router = express.Router();
const Variante = require('../models/Variante');
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

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: ¡Solo se permiten imágenes!');
        }
    }
});

// Obtener variantes buenas
router.get('/buenas', async (req, res) => {
    try {
        const variantes = await Variante.find({ esBuena: true });
        res.json(variantes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener variantes malas
router.get('/malas', async (req, res) => {
    try {
        const variantes = await Variante.find({ esBuena: false });
        res.json(variantes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Añadir una nueva variante
router.post('/', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen.');
    }

    const variante = new Variante({
        nombre: req.body.nombre,
        habilidad: req.body.habilidad,
        imagenUrl: `img/${req.file.filename}`,
        esBuena: req.body.esBuena === 'true'
    });

    try {
        const nuevaVariante = await variante.save();
        res.status(201).json(nuevaVariante);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;