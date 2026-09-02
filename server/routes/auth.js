const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");

/*
====================================
SEND OTP
====================================
*/
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save/update OTP
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    // Send email using Nodemailer
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your_email@gmail.com",
        pass: process.env.EMAIL_PASS || "your_app_password",
      },
    });

    const mailOptions = {
      from: `"Clazo Support" <${process.env.EMAIL_USER || "noreply@clazo.com"}>`,
      to: email,
      subject: "Clazo Portal - Email Verification Code",
      text: `Your Clazo verification OTP code is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; border-radius: 12px; max-width: 600px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Email Verification</h2>
          <p style="font-size: 16px; color: #3f3f46;">Hi,</p>
          <p style="font-size: 16px; color: #3f3f46;">Thank you for registering on Clazo. Please use the following 6-digit OTP code to verify your email:</p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e4e4e7; font-size: 24px; font-weight: bold; text-align: center; color: #4f46e5; letter-spacing: 4px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #71717a;">This code will expire in 5 minutes.</p>
        </div>
      `,
    };

    console.log(`[OTP Verification Code] For email: ${email} -> CODE: ${otp}`);

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== "your_email@gmail.com") {
        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.warn("Mail dispatch failed, showing code in console logs instead:", mailErr.message);
    }

    res.json({
      success: true,
      message: "OTP code generated and dispatched successfully.",
      otp: process.env.NODE_ENV === "production" ? undefined : otp
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
VERIFY OTP
====================================
*/
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required." });
    }

    const record = await Otp.findOne({ email: email.toLowerCase() });
    if (!record) {
      return res.status(400).json({ message: "No verification code requested for this email." });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({ message: "OTP code has expired. Please request a new one." });
    }

    if (record.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP verification code." });
    }

    record.verified = true;
    await record.save();

    res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
REGISTER
====================================
*/
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      password,
      grade,
      teacherId,
      studentCode,
      phone,
      gender,
      dob,
      address,
    } = req.body;

    if (!name || !role || !password || !email) {
      return res.status(400).json({
        message: "Name, email, role and password are required.",
      });
    }

    // Verify OTP record exists
    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), verified: true });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Email verification is required. Please verify via OTP first."
      });
    }

    // Check duplicate user
    const duplicateEmail = await User.findOne({ email: email.toLowerCase() });
    if (duplicateEmail) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    let existingUser = null;

    switch (role) {
      case "teacher":
        if (!teacherId) {
          return res.status(400).json({
            message: "Teacher ID is required.",
          });
        }

        existingUser = await User.findOne({ teacherId });
        break;

      case "student":
        if (!studentCode) {
          return res.status(400).json({
            message: "Student Code is required.",
          });
        }

        existingUser = await User.findOne({ studentCode });
        break;

      case "parent":
      case "admin":
      case "company-admin":
        if (!phone) {
          return res.status(400).json({
            message: "Phone / Mobile number is required.",
          });
        }

        existingUser = await User.findOne({ phone });
        break;

      default:
        break;
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let finalStudentCode = studentCode;
    let finalRollNumber = undefined;
    const Class = require("../models/Class");
    let studentClass = null;

    if (role === "student") {
      const gradeNum = grade ? grade.replace(/\D/g, "") : "10";
      const targetClassName = `Class ${gradeNum}`;
      studentClass = await Class.findOne({ name: targetClassName });
      if (studentClass) {
        const nextIndex = studentClass.students.length + 1;
        if (!finalStudentCode) {
          finalStudentCode = `S${gradeNum}${String(nextIndex).padStart(2, '0')}`;
        }
        finalRollNumber = String(nextIndex);
      } else {
        if (!finalStudentCode) {
          finalStudentCode = "S" + Math.floor(1000 + Math.random() * 9000);
        }
        finalRollNumber = "1";
      }
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      role,
      password: hashedPassword,
      grade: grade || "10th",
      teacherId: teacherId || undefined,
      studentCode: finalStudentCode || undefined,
      studentId: finalStudentCode || undefined,
      classId: studentClass ? studentClass._id : null,
      rollNumber: finalRollNumber,
      phone: phone || undefined,
      gender: gender || undefined,
      dob: dob || undefined,
      address: address || undefined,
    });

    await user.save();

    // Clean up verified OTP
    await Otp.deleteMany({ email: email.toLowerCase() });

    // Link student to class
    if (role === "student" && studentClass) {
      studentClass.students.push(user._id);
      await studentClass.save();
    }

    // Create notifications for Admin
    try {
      const { createNotification } = require("../utils/notify");
      const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
      for (const admin of admins) {
        await createNotification(admin._id, "New Student Registered", `Student "${user.name}" has successfully registered.`);
      }
      if (req.io) {
        req.io.emit("studentRegistered", { studentId: user._id, name: user.name });
      }
    } catch (notifErr) {
      console.error("Failed to trigger registration notifications:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
====================================
LOGIN
====================================
*/
router.post("/login", async (req, res) => {
  try {
    const {
      role,
      password,
      teacherId,
      studentCode,
      phone,
    } = req.body;

    let user = null;

    switch (role) {
      case "teacher":
        user = await User.findOne({ teacherId });
        break;

      case "student":
        user = await User.findOne({ studentCode });
        break;

      case "admin":
      case "company-admin":
        user = await User.findOne({ role, phone });
        if (!user) {
          user = await User.findOne({ role });
        }
        break;

      default:
        return res.status(400).json({
          message: "Invalid role.",
        });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Update tracking
    user.lastLogin = new Date();
    user.isOnline = true;
    
    const isFirstLogin = !user.loginHistory || user.loginHistory.length === 0;
    if (!user.loginHistory) user.loginHistory = [];

    user.loginHistory.push({
      date: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress || "127.0.0.1"
    });
    
    await user.save();

    // Trigger Notifications & Real-Time alerts
    try {
      const { createNotification } = require("../utils/notify");
      if (user.role === "student") {
        const Class = require("../models/Class");
        const studentClass = await Class.findOne({ students: user._id });
        if (studentClass && studentClass.teacherId) {
          await createNotification(
            studentClass.teacherId,
            "Student Logged In",
            `Student "${user.name}" has logged in.`
          );
        }

        if (isFirstLogin) {
          const admins = await User.find({ role: { $in: ["admin", "company-admin"] } });
          for (const admin of admins) {
            await createNotification(
              admin._id,
              "First Login",
              `Student "${user.name}" logged in for the first time.`
            );
          }
        }

        if (req.io) {
          req.io.emit("studentLoggedIn", {
            studentId: user._id,
            name: user.name,
            classId: studentClass?._id,
            isOnline: true,
            lastLogin: user.lastLogin
          });
        }
      }
    } catch(notifErr) {
      console.error("Login notification failed:", notifErr);
    }

    // Find student class
    let userClassId = user.classId;
    if (!userClassId && user.role === "student") {
      const Class = require("../models/Class");
      const studentClass = await Class.findOne({ students: user._id });
      if (studentClass) {
        userClassId = studentClass._id;
        user.classId = studentClass._id;
        await user.save();
      }
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        grade: user.grade,
        classId: userClassId || null,
        teacherId: user.teacherId,
        studentCode: user.studentCode,
        phone: user.phone,
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Reset code storage mapping (in-memory for local development)
const resetCodes = new Map();

/*
====================================
FORGOT PASSWORD
====================================
*/
router.post("/forgot-password", async (req, res) => {
  try {
    const { role, identifier } = req.body;
    let query = {};
    if (role === "teacher") query = { teacherId: identifier };
    else if (role === "student") query = { studentCode: identifier };
    else if (role === "parent") query = { phone: identifier };
    else query = { role: "admin" };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(code, user._id.toString());
    
    console.log(`🔑 PASSWORD RESET CODE FOR ${user.name} (${user.role}): ${code}`);

    res.json({
      success: true,
      message: `Reset code generated: ${code} (sent to console logs)`,
      code // Return it for easy UI testing
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
RESET PASSWORD
====================================
*/
router.post("/reset-password", async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    const userId = resetCodes.get(code);

    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    resetCodes.delete(code);

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const { authMiddleware } = require("../middleware/auth");

/*
====================================
CHANGE PASSWORD (AUTH REQUIRED)
====================================
*/
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
UPDATE PROFILE (AUTH REQUIRED)
====================================
*/
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, grade } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (grade) user.grade = grade;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        grade: user.grade,
        teacherId: user.teacherId,
        studentCode: user.studentCode,
        phone: user.phone,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
REFRESH TOKEN
====================================
*/
router.post("/refresh", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey_for_clazlo_123',
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        grade: user.grade,
        teacherId: user.teacherId,
        studentCode: user.studentCode,
        phone: user.phone,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/*
====================================
AI CHATBOT ENGINE
====================================
*/
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const msg = message ? message.toLowerCase() : "";

    let reply = "I am your AI study buddy. You can ask me about class timetables, teachers, subjects, exam results, or upcoming events!";

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("yo")) {
      reply = `Hello ${user.name}! How can I help you today with your Clazlo dashboard, classes, or notices?`;
    } 
    else if (msg.includes("timetable") || msg.includes("schedule") || msg.includes("class slot") || msg.includes("routine")) {
      const Class = require("../models/Class");
      const Timetable = require("../models/Timetable");
      
      let targetClass = null;
      if (userRole === "student") {
        targetClass = await Class.findOne({ students: userId });
      } else if (userRole === "parent") {
        targetClass = await Class.findOne({ students: { $in: user.studentIds } });
      } else if (userRole === "teacher") {
        targetClass = await Class.findOne({ teacherId: userId });
      }

      if (targetClass) {
        const timetable = await Timetable.find({ classId: targetClass._id });
        if (timetable && timetable.length > 0) {
          reply = `Here is the timetable schedule for ${targetClass.name}-${targetClass.section}:\n` +
            timetable.map(t => `- **${t.day}**: ${t.slots.map(s => `${s.subject} (${s.time})`).join(", ")}`).join("\n");
        } else {
          reply = `No timetable slots found for class ${targetClass.name}-${targetClass.section}.`;
        }
      } else {
        reply = "You are not currently linked to an active class to view schedules.";
      }
    } 
    else if (msg.includes("teacher") || msg.includes("instructor") || msg.includes("faculty") || msg.includes("staff")) {
      const teachers = await User.find({ role: "teacher" }).select("name subjects phone");
      reply = "Here is the list of faculty members:\n" +
        teachers.map(t => `- **${t.name}**: Teaches ${t.subjects.join(", ")} (Contact: ${t.phone || 'N/A'})`).join("\n");
    } 
    else if (msg.includes("exam") || msg.includes("result") || msg.includes("mark") || msg.includes("score") || msg.includes("grade")) {
      const Result = require("../models/Result");
      let results = [];
      if (userRole === "student") {
        results = await Result.find({ studentId: userId });
      } else if (userRole === "parent") {
        results = await Result.find({ studentId: { $in: user.studentIds } }).populate("studentId", "name");
      } else if (userRole === "teacher") {
        results = await Result.find({ teacherId: userId }).populate("studentId", "name");
      }

      if (results && results.length > 0) {
        reply = "Here are the latest exam results:\n" +
          results.map(r => `- ${userRole === "parent" || userRole === "teacher" ? `**${r.studentId?.name}** - ` : ""}${r.subject} (${r.examType}): **${r.marksObtained}/${r.totalMarks}** - Grade: ${r.grade} (${r.remarks})`).join("\n");
      } else {
        reply = "No exam results found in the database.";
      }
    }
    else if (msg.includes("notice") || msg.includes("announcement") || msg.includes("holiday")) {
      const Notice = require("../models/Notice");
      const notices = await Notice.find().sort({ createdAt: -1 }).limit(5);
      if (notices && notices.length > 0) {
        reply = "Here are the latest school notices:\n" +
          notices.map(n => `- **${n.title}**: ${n.content}`).join("\n");
      } else {
        reply = "There are no notices published on the notice board.";
      }
    }
    else if (msg.includes("event") || msg.includes("sports day") || msg.includes("science exhibition") || msg.includes("cultural fest")) {
      const Event = require("../models/Event");
      const events = await Event.find().sort({ date: 1 }).limit(5);
      if (events && events.length > 0) {
        reply = "Here are the upcoming school events:\n" +
          events.map(e => `- **${e.title}** (${new Date(e.date).toLocaleDateString()}): ${e.description} at ${e.location}`).join("\n");
      } else {
        reply = "No upcoming events scheduled.";
      }
    }
    else if (msg.includes("how many students") || msg.includes("total students") || msg.includes("student count")) {
      const totalStudents = await User.countDocuments({ role: "student" });
      reply = `There are currently ${totalStudents} students registered in the school database.`;
    }
    else if (msg.includes("capital of india")) {
      reply = "The capital of India is **New Delhi**.";
    }
    else if (msg.includes("basic unit of life") || msg.includes("photosynthesis")) {
      reply = "The basic unit of life is the **Cell**, and plants use **Carbon Dioxide** for photosynthesis.";
    }
    else if (msg.includes("romeo and juliet")) {
      reply = "Romeo and Juliet was written by the famous playwright **William Shakespeare**.";
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
GET SHARED ACADEMIC EVENTS
====================================
*/
router.get("/events", authMiddleware, async (req, res) => {
  try {
    const Event = require("../models/Event");
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
GET USER NOTIFICATIONS
====================================
*/
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
====================================
MARK NOTIFICATION AS READ
====================================
*/
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;