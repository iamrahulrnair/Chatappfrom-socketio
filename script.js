const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const name = prompt("what is your name?");
appendMEssage("you Joined...");

socket.on("chat-message", (data) => {
  appendMEssage(`${data.name}:${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMEssage(`${name} connected`);
});

socket.emit("new-user", name);
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.length > 0) {
    appendMEssage(`You:${message}`);

    socket.emit("send-chat-message", message);
    messageInput.value = "";
    socket.emit("typing-stopped");
  }
});

socket.on("user-disconnected", (name) => {
  appendMEssage(`${name} disconnected`);
});

messageInput.addEventListener("input", (e) => {
  if (e.target.value.length !== 0) {
    socket.emit("typing");
  } else if (e.target.value.length == 0) {
    socket.emit("typing-stopped");
  }
});
socket.on("user-typing", (name) => {
  if (!document.querySelector(".user-typing--1")) {
    appendTyping(name);
  }
});
socket.on("typing-stopped", () => {
  console.log("here");
  document.querySelector(".user-typing--1").remove();
});
socket.on("online-users", (users) => {
  console.log(users);
});
function appendMEssage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
function appendTyping(name) {
  const messageElement = document.createElement("div");
  messageElement.innerText = `${name} typing...`;
  messageElement.classList.add("user-typing--1");
  messageContainer.append(messageElement);
}
