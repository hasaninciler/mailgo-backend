const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Kategori ismi zorunludur' });
    }
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// UPDATE - kategori güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    await category.update({ name, description });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    await category.destroy();
    res.status(200).json({ message: 'Kategori silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;