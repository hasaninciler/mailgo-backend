const express = require('express');
const { Subscriber, Category } = require('../models');
const multer = require('multer');
const { parse } = require('csv-parse/sync');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, categoryId } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'İsim ve email zorunludur' });
    }
    const subscriber = await Subscriber.create({ name, email, categoryId });
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.findAll({
      include: Category,
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, email, categoryId, isSubscribed } = req.body;
    const subscriber = await Subscriber.findByPk(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber bulunamadı' });
    }
    await subscriber.update({ name, email, categoryId, isSubscribed });
    res.status(200).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByPk(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber bulunamadı' });
    }
    await subscriber.destroy();
    res.status(200).json({ message: 'Subscriber silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const csvText = req.file.buffer.toString('utf-8');

    const records = parse(csvText, {
      columns: true,        
      skip_empty_lines: true,
      trim: true,
    });

    const { categoryId } = req.body;

    let added = 0;
    let skipped = 0;
    const errors = [];

    for (const row of records) {
      if (!row.name || !row.email) {
        skipped++;
        continue;
      }
      try {
        await Subscriber.create({
          name: row.name,
          email: row.email,
          categoryId: categoryId || null,
        });
        added++;
      } catch (err) {
        skipped++;
        errors.push(`${row.email}: ${err.message}`);
      }
    }

    res.status(200).json({
      message: 'İçe aktarma tamamlandı',
      added,
      skipped,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;