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

module.exports = router;