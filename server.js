const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const {userJoin, getUser, userLeave, getRoomUsers} = require("./utils/users")

const botName = "ChatBot"

const app = express()
const server = http.createServer(app)
const io = socketio(server)
// static
app.use(express.static(path.join(__dirname, "public")))

io.on("connection", socket => {
  socket.on('JoinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    //Welcome message to user
    socket.emit('message', formatMessage(botName, `Welcome to chat, ${user.username}!!!`))
  
    //Broadcast when user connect
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined to ${room} chat room`))
  
    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id)

    io.to(user.room).emit("message", formatMessage(user.username, msg))
  })

  //Runs when user disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id)

    if(user) {
      io.to(user.room).emit(
        "message", 
        formatMessage(botName, `${user.username} has left the chat`))
    
        //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
})

const PORT = 4000 || process.env.PORT

server.listen(PORT, () => {
  console.log(`Server start on http://localhost:${PORT}`)
})