const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Create an Express app
const app = express();
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Create an HTTP server using the Express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Event handler when a new socket connection is established
io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);

  // Event handler for receiving messages from clients
  socket.on("message", (message) => {
    console.log("message:", message);
    // Broadcast the received message to all connected clients
    io.emit("message", message);
  });

  // Event handler when a client disconnects
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Define the port number for the server to listen on
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
