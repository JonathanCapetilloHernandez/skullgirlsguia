const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            'supersecretkey', // Debería estar en una variable de entorno
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;