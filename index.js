const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');
require('./models');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const categoryRoutes = require('./routes/categories');
const campaignRoutes = require('./routes/campaigns');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use('/api/campaigns', campaignRoutes);
const subscriberRoutes = require('./routes/subscribers');
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

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