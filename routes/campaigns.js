const express = require('express');
const Campaign = require('../models/Campaign');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { name, description, targetUrl } = req.body;
    if (!name || !targetUrl) {
      return res.status(400).json({ message: 'Kampanya ismi ve hedef link zorunludur' });
    }
    const campaign = await Campaign.create({ name, description, targetUrl });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, targetUrl } = req.body;
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
    await campaign.update({ name, description, targetUrl });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
    await campaign.destroy();
    res.status(200).json({ message: 'Kampanya silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/:id/click', async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }
    campaign.clickCount += 1;
    await campaign.save();
    res.redirect(campaign.targetUrl);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;