const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Homework = require('../models/Homework');
const User = require('../models/User');

async function check() {
  const uris = [
    "mongodb://localhost:27017/clazlo",
    "mongodb://127.0.0.1:27017/clazlo",
    "mongodb://localhost:27017/clazo",
    "mongodb://127.0.0.1:27017/clazo"
  ];
  
  let connected = false;
  for (const uri of uris) {
    try {
      console.log("Trying to connect to:", uri);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 });
      console.log("Connected successfully to:", uri);
      connected = true;
      break;
    } catch (e) {
      console.log("Failed to connect to:", uri);
    }
  }

  if (!connected) {
    console.error("Could not connect to any local MongoDB instance.");
    process.exit(1);
  }
  
  try {
    const student = await User.findOne({ email: 'student1@school.com' });
    if (student) {
      console.log("student1 ID:", student._id.toString());
    } else {
      console.log("student1 not found!");
    }

    const hws = await Homework.find();
    console.log("Total homeworks in DB:", hws.length);
    hws.forEach(h => {
      console.log(`- Title: "${h.title}", Submissions: ${h.submissions.length}`);
      h.submissions.forEach((s, idx) => {
        console.log(`   [${idx}] studentId: ${s.studentId}, status: ${s.status}`);
      });
    });
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
