const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

// Get userNme and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io()

//Join room
socket.emit("JoinRoom", {username, room})

// Get room and users
socket.on("roomUsers", ({room, users}) => {
  outputRoomName(room)
  outputUsers(users)
})

//Message from server
socket.on("message", message => {
  console.log(message);
  outputMessage(message)

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

})

chatForm.addEventListener("submit", (e) => {
  e.preventDefault()

  //Get message text
  const msg = e.target.elements.msg.value

  //Emmit message to server
  socket.emit("chatMessage", msg);

  //Clear input
  e.target.elements.msg.value = ''
  
})

//Output message from DOM
function outputMessage(message) {
  const div =  document.createElement("div")
  div.classList.add("message")
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div)
}

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;

}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(u => `<li>${u.username}</li>`).join("")}
  `
}