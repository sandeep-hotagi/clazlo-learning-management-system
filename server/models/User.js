const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true },
  
  // For Teacher
  teacherId: { type: String, unique: true, sparse: true },
  
  // For Student
  studentCode: { type: String, unique: true, sparse: true },
  
  // For Parent
  phone: { type: String, unique: true, sparse: true },
  
  // Universal identifier/password (though not all might use passwords, prompt says: "hashing passwords")
  password: { type: String, required: true },
  
  // Relationships
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for students to link parents
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // for parents to link students

  // Subjects / Profile info
  subjects: [{ type: String }],
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
