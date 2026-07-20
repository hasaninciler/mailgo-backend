const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const formatName = (str) =>
  str
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)
    .map(
      (word) =>
        word.charAt(0).toLocaleUpperCase('tr-TR') +
        word.slice(1).toLocaleLowerCase('tr-TR')
    )
    .join(' ');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Bu email zaten kullanımda' });
    }

    const formattedName = formatName(name);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: formattedName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Kayıt başarılı',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;