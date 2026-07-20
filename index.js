const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
require('dotenv').config();
require('./models');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const campaignRoutes = require('./routes/campaigns');
const subscriberRoutes = require('./routes/subscribers');
const analyticsRoutes = require('./routes/analytics');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/campaigns', authMiddleware, campaignRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/subscribers', authMiddleware, subscriberRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'api aktif' });
});

app.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    try {
        await sequelize.authenticate();
        console.log("database aktif");
        await sequelize.sync();
        console.log('tablolar sekronozie ediledi');
    } catch (error) {
        console.error('database de hata var', error.message);
    }
});