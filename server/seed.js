const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    console.log('Connected to Memory DB');

    // Clear users
    await User.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // Create Teacher
    const teacher = new User({
      name: 'John Teacher',
      role: 'teacher',
      teacherId: 'T1001',
      password
    });
    await teacher.save();

    // Create Student
    const student = new User({
      name: 'Alice Student',
      role: 'student',
      studentCode: 'S2001',
      password
    });
    await student.save();

    // Create Parent
    const parent = new User({
      name: 'Bob Parent',
      role: 'parent',
      phone: '1234567890',
      password
    });
    await parent.save();

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
