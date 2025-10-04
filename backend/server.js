const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const dbURI = process.env.MONGODB_URI;
console.log('Intentando conectar a MongoDB...');
mongoose.connect(dbURI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
const variantesRouter = require('./routes/variantes');
const combosRouter = require('./routes/combos');
const efectosRouter = require('./routes/efectos');

app.use('/api/variantes', variantesRouter);
app.use('/api/combos', combosRouter);
app.use('/api/efectos', efectosRouter);

// Servir archivos estáticos (para el frontend)
app.use(express.static('../'));
app.use('/videos', express.static(path.join(__dirname, '../videos')));


app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
