const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route POST /api/auth/register (Mocked for guaranteed UI flow)
router.post('/register', async (req, res) => {
  try {
    const { name, role } = req.body;
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route POST /api/auth/login (Mocked)
router.post('/login', async (req, res) => {
  try {
    const { role, grade, name, adminType } = req.body;

    const payload = {
      id: 'mocked-id-101',
      role: role || 'student',
      grade: grade || '10th',
      name:
        name ||
        (role === 'teacher'
          ? 'Teacher Account'
          : role === 'admin'
          ? (adminType === 'company' ? 'Company Admin' : 'School Admin')
          : 'Student Account'),
    };

    if (role === 'admin') {
      payload.adminType = adminType || 'school';
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey_for_clazlo_123', { expiresIn: '1d' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
