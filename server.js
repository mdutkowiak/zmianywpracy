const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const db = require('./db');

// Inicjalizacja dotenv
dotenv.config();

// Inicjalizacja Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Podpięcie tras (autoryzacja + harmonogram)
app.use('/api/auth', authRoutes);
app.use('/api', scheduleRoutes);  

// Start serwera
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
