const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // frontend allow
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Test API
app.get("/api/ping", (req, res) => {
  res.json({ message: "✅ Backend running fine!" });
});

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`👥 User ${socket.id} joined room: ${room}`);
    io.to(room).emit("system", `New user joined room ${room}`);
  });

  socket.on("chat-message", (data) => {
    io.to(data.room).emit("chat-message", { sender: data.sender, text: data.text });
  });

  socket.on("draw", (data) => {
    socket.to(data.room).emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
