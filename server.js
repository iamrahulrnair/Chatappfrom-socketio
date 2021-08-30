const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});
const users = {};
io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.emit("online-users", users);
    socket.broadcast.emit("online-users", users);
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", { message, name: users[socket.id] });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
  socket.on("typing", () => {
    socket.broadcast.emit("user-typing", users[socket.id]);
  });
  socket.on("typing-stopped", () => {
    socket.broadcast.emit("typing-stopped");
  });
});
