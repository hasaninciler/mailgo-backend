const express = require('express');
const { Subscriber, Campaign } = require('../models');
const { Op, fn, col } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const totalSubscribers = await Subscriber.count({ where: dateFilter });

    const unsubscribedCount = await Subscriber.count({
      where: { ...dateFilter, isSubscribed: false },
    });

    const totalSentMails = await Subscriber.sum('sentMailCount', { where: dateFilter });

    const totalCampaignClicks = await Campaign.sum('clickCount');

    res.status(200).json({
      totalSubscribers,
      unsubscribedCount,
      totalSentMails: totalSentMails || 0,
      totalCampaignClicks: totalCampaignClicks || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/subscribers-weekly', async (req, res) => {
  try {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Subscriber.count({
        where: {
          createdAt: { [Op.between]: [dayStart, dayEnd] },
        },
      });

      const dayName = dayStart.toLocaleDateString('tr-TR', { weekday: 'short' });

      days.push({ day: dayName, count });
    }

    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;