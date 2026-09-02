const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();

const app = express();

// Express 5 query getter compatibility workaround for legacy middleware (like express-mongo-sanitize)
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development & local socket connections
}));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use(limiter);

app.use(cors({
  origin: true, // Support mobile devices accessing via local IP (192.168.x.x), tunnels, and localhost
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

// ==========================
// MONGODB CONNECTION
// ==========================
const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  try {
    if (!dbUri) throw new Error("No MONGODB_URI provided in environment.");
    await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Production MongoDB Atlas Connected Successfully");
  } catch (err) {
    console.warn("⚠️ Production MongoDB Connection Failed:", err.message);
    console.log("🌱 Starting In-Memory MongoDB Fallback Server...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.disconnect();
      await mongoose.connect(mongoUri);
      console.log("✅ In-Memory MongoDB Connected Successfully:", mongoUri);
      
      // Load seeder
      const seed = require("./seed");
      await seed(mongoUri);
    } catch (memErr) {
      console.error("❌ Failed to start In-Memory MongoDB:", memErr);
      process.exit(1);
    }
  }
};

connectDB();

// ==========================
// SOCKET.IO REAL-TIME CHAT
// ==========================
io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  socket.on("registerSocketUser", async ({ userId }) => {
    socket.userId = userId;
    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("statusChanged", { userId, isOnline: true });
    } catch(err) {
      console.error("Error setting user online:", err);
    }
  });

  socket.on("joinClass", (classId) => {
    socket.join(classId);
    console.log(`User socket ${socket.id} joined class: ${classId}`);
  });

  socket.on("sendMessage", async ({ senderId, classId, message }) => {
    try {
      const Message = require("./models/Message");
      const User = require("./models/User");

      const msgObj = new Message({
        senderId,
        classId,
        message
      });
      await msgObj.save();

      const sender = await User.findById(senderId);
      const broadcastData = {
        id: msgObj._id,
        sender: sender?.name || "System",
        senderRole: sender?.role || "admin",
        text: message,
        time: new Date().toLocaleTimeString(),
      };

      io.to(classId).emit("receiveMessage", broadcastData);
    } catch (err) {
      console.error("Socket send message error:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log(`Socket Disconnected: ${socket.id}`);
    if (socket.userId) {
      try {
        const User = require("./models/User");
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
        io.emit("statusChanged", { userId: socket.userId, isOnline: false });
      } catch(err) {
        console.error("Error setting user offline:", err);
      }
    }
  });
});

// Middleware to attach socket.io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/student", require("./routes/student"));
app.use("/api/teacher", require("./routes/teacher"));
app.use("/api/homework", require("./routes/homework"));
app.use("/api/assignment", require("./routes/assignment"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/search", require("./routes/search"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/naac", require("./routes/naac"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Clazlo API Running 🚀");
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false
  });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});