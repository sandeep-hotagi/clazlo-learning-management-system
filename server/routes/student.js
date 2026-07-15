const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

router.use(authMiddleware);
router.use(roleMiddleware(['student']));

router.get('/profile', async (req, res) => {
  // Return student profile
  res.json(req.user);
});

router.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({ "records.studentId": req.user.id });
    // Filter to only show their own records
    const mapped = attendance.map(a => ({
        date: a.date,
        status: a.records.find(r => r.studentId.toString() === req.user.id.toString())?.status
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
