const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Class = require('../models/Class');
const User = require('../models/User');

async function checkDb() {
  try {
    // If there is an in-memory db url in the env or we use the local one
    const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/clazo";
    console.log("Connecting to:", dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Connected successfully!");

    const users = await User.find({ role: 'teacher' });
    console.log("\n--- TEACHERS IN DB ---");
    users.forEach(u => {
      console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`);
    });

    const classes = await Class.find();
    console.log("\n--- CLASSES IN DB ---");
    classes.forEach(c => {
      console.log(`ID: ${c._id}, Name: ${c.name}, Section: ${c.section}, TeacherID Field: ${c.teacherId}`);
    });

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkDb();
