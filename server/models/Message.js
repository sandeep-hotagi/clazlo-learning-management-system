const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for class-wide messages
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // For group chats
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
