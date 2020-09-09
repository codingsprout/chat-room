const socket = io();
const chatRoomMessages = document.querySelector(".chat-messages");
const chatRoomForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);

socket.emit("joinChatRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatRoomMessages.scrollTop = chatRoomMessages.scrollHeight;
});

chatRoomForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
