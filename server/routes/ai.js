const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

// Local rule-based AI content store
const aiDatabase = {
  photosynthesis: {
    notes: `## Photosynthesis & Chloroplasts Notes
Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.

### Core Stages
1. **Light-dependent Reactions**: Occur in the thylakoid membrane. Chlorophyll absorbs light energy and makes ATP and NADPH. Water is split, releasing oxygen.
2. **Calvin Cycle (Light-independent)**: Occurs in the stroma. Carbon dioxide is converted into glucose using ATP and NADPH.

### Key Factors
* Light Intensity
* Carbon Dioxide concentration
* Temperature`,
    quiz: [
      { question: "What pigment absorbs light during photosynthesis?", options: ["Chlorophyll", "Carotene", "Xanthophyll", "Anthocyanin"], answer: "Chlorophyll" },
      { question: "Where do the light-dependent reactions take place?", options: ["Stroma", "Thylakoid Membrane", "Mitochondria", "Cytoplasm"], answer: "Thylakoid Membrane" },
      { question: "Which gas is released as a byproduct of water splitting?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: "Oxygen" }
    ],
    replies: [
      "Photosynthesis takes place primarily in the chloroplasts of plant cells.",
      "The chemical formula for photosynthesis is: 6CO2 + 6H2O + light -> C6H12O6 + 6O2.",
      "Plants use microscopic pores called stomata to take in carbon dioxide and release oxygen."
    ]
  },
  algebra: {
    notes: `## Introduction to Algebra & Equations
Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.

### Linear Equations
A linear equation is an equation for a straight line. The standard form is:
**y = mx + c**
Where:
* **m** is the slope of the line.
* **c** is the y-intercept.

### Solving for Variables
To solve an equation like 2x + 3 = 11:
1. Subtract 3 from both sides: 2x = 8.
2. Divide by 2: x = 4.`,
    quiz: [
      { question: "What is the value of x in the equation 3x - 5 = 10?", options: ["3", "4", "5", "6"], answer: "5" },
      { question: "What does the 'm' represent in the slope-intercept form equation y = mx + c?", options: ["y-intercept", "x-intercept", "Slope", "Coordinate"], answer: "Slope" }
    ],
    replies: [
      "Algebra allows us to solve for unknown variables by balancing mathematical statements.",
      "Quadratic equations take the form ax^2 + bx + c = 0 and have up to two real solutions.",
      "The word algebra comes from the Arabic 'al-jabr' meaning restoration of broken parts."
    ]
  }
};

/*
=========================================
1. AI DOUBTS CHATBOT
=========================================
*/
router.post("/chat", async (req, res) => {
  try {
    const { message, subject } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message query is required." });
    }

    const text = message.toLowerCase();
    let reply = "That is an interesting topic! I suggest reading up on textbook chapters related to it. Feel free to ask another specific question.";

    // Rule matchers
    if (text.includes("photosynthesis") || text.includes("plant") || text.includes("leaf")) {
      const idx = Math.floor(Math.random() * aiDatabase.photosynthesis.replies.length);
      reply = aiDatabase.photosynthesis.replies[idx];
    } else if (text.includes("algebra") || text.includes("equation") || text.includes("solve")) {
      const idx = Math.floor(Math.random() * aiDatabase.algebra.replies.length);
      reply = aiDatabase.algebra.replies[idx];
    } else if (text.includes("hello") || text.includes("hi")) {
      reply = `Hello! I am your Clazo AI learning buddy. How can I help you in your ${subject || 'studies'} today?`;
    } else if (text.includes("time") || text.includes("schedule")) {
      reply = "You can view your daily classes under the Timetable tab. Be sure to review study slots!";
    }

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
2. AI MCQ QUIZ GENERATOR
=========================================
*/
router.post("/quiz-generator", async (req, res) => {
  try {
    const { subject, topic, numQuestions } = req.body;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const cleanTopic = topic.toLowerCase();
    let questions = [];

    if (cleanTopic.includes("photosynthesis") || cleanTopic.includes("plant")) {
      questions = [...aiDatabase.photosynthesis.quiz];
    } else if (cleanTopic.includes("algebra") || cleanTopic.includes("equation")) {
      questions = [...aiDatabase.algebra.quiz];
    } else {
      // Fallback generator
      const n = Number(numQuestions) || 3;
      for (let i = 1; i <= n; i++) {
        questions.push({
          question: `Sample AI Question ${i} about ${topic}: Which option is correct?`,
          options: ["Correct Option", "Alternative Option 1", "Alternative Option 2", "Alternative Option 3"],
          answer: "Correct Option"
        });
      }
    }

    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
3. AI STUDY NOTES GENERATOR
=========================================
*/
router.post("/notes-generator", async (req, res) => {
  try {
    const { topic, subject, grade } = req.body;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const cleanTopic = topic.toLowerCase();
    let notes = "";

    if (cleanTopic.includes("photosynthesis") || cleanTopic.includes("plant")) {
      notes = aiDatabase.photosynthesis.notes;
    } else if (cleanTopic.includes("algebra") || cleanTopic.includes("equation")) {
      notes = aiDatabase.algebra.notes;
    } else {
      // Dynamic markdown generator
      notes = `## AI Study Guide: ${topic}
This guide provides an overview of the topic **${topic}** prepared for **${grade || 'General'}** level study in **${subject || 'General Studies'}**.

### Key Concept Overview
* **Primary Principle**: Understanding the fundamental elements and variables defining ${topic}.
* **Practical Application**: Solving problems and executing labs associated with this curriculum area.

### Recommended Steps
1. Read textbook definitions and solve key review questions.
2. Formulate study schedules with revision notes.`;
    }

    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
=========================================
4. AI STUDY PLANNER
=========================================
*/
router.post("/study-planner", async (req, res) => {
  try {
    const { subjects } = req.body;
    const list = Array.isArray(subjects) && subjects.length > 0 ? subjects : ["Mathematics", "Science", "English"];
    
    // Generate prioritization list
    const priority = list.map((sub, idx) => ({
      subject: sub,
      priority: idx === 0 ? "High" : idx === 1 ? "Medium" : "Low",
      durationHours: idx === 0 ? 2 : 1,
      recommendation: idx === 0 ? "Focus on solving core exercises and formula sheet review." : "Read chapter summaries."
    }));

    res.json({
      success: true,
      studySchedule: priority,
      reminders: [
        "Take a 10-minute break after every 50 minutes of focused study.",
        "Solve sample problems daily to track improvement.",
        "Check notices board for test dates."
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
