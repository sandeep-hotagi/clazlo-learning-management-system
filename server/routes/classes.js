const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const { authMiddleware } = require("../middleware/auth");

/*
=========================================
GET STUDENTS OF A CLASS
=========================================
*/
router.get("/:id/students", authMiddleware, async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate("students", "-password");
    if (!classObj) {
      return res.status(404).json({ message: "Class not found." });
    }
    
    // Authorization check: teachers can only view their own class if they are not admin
    if (req.user.role === "teacher" && classObj.teacherId && classObj.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this class." });
    }
    
    res.json(classObj.students || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
