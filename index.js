const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5001;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'api aktif' });
});

app.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    try {
        await sequelize.authenticate();
        console.log('Veritabanı bağlantısı başarılı ✅');
        await sequelize.sync();
        console.log('Tablolar senkronize edildi ✅');
    } catch (error) {
        console.error('Veritabanı bağlantı hatası ❌:', error.message);
    }
});