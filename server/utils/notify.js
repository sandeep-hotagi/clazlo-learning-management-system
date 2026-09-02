const Notification = require("../models/Notification");

/**
 * Helper to record a new user notification.
 * @param {string|mongoose.Types.ObjectId} userId - The target recipient's user ID.
 * @param {string} title - The title of the alert.
 * @param {string} description - The detailed description of the alert.
 */
const createNotification = async (userId, title, description) => {
  try {
    const notification = new Notification({
      userId,
      title,
      description,
    });
    await notification.save();
    console.log(`Notification created for user ${userId}: "${title}"`);

    if (global.io) {
      global.io.emit("notificationReceived", {
        userId: userId.toString(),
        notification
      });
    }
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};

module.exports = { createNotification };
