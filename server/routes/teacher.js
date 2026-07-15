const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Class = require('../models/Class');
const User = require('../models/User');

router.use(authMiddleware);
router.use(roleMiddleware(['teacher']));

// Get all classes for teacher
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find({ teacherId: req.user.id });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create class
router.post('/classes', async (req, res) => {
  try {
    const { name, section } = req.body;
    const newClass = new Class({ name, section, teacherId: req.user.id });
    await newClass.save();
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
router.post('/students', async (req, res) => {
  try {
    // Basic logic to generate random student code
    const studentCode = 'STU' + Math.floor(Math.random() * 10000);
    const { name, password, classId } = req.body;
    
    const newUser = new User({
      name,
      role: 'student',
      studentCode,
      password // Needs hashing, ignoring here for simplicity or should hash before save
    });
    
    // Better hash it
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password || '123456', salt);

    await newUser.save();

    if (classId) {
      await Class.findByIdAndUpdate(classId, { $push: { students: newUser._id } });
    }

    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
