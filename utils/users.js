const users = [];

//Join to chat
function userJoin(id, username, room) {
  const user = {id, username, room}

  users.push(user)

  return user
}

//Get user
function getUser(id) {
  return users.find(u => u.id === id)
}

//User leaves chat
function userLeave(id) {
  const index = users.findIndex(u => u.id === id)

  if(index !== -1) {
    return users.splice(index, 1)[0]
  }
}

//Get room users
function getRoomUsers(room) {
  return users.filter(u => u.room === room)
}

module.exports = {
  userJoin,
  getUser,
  userLeave,
  getRoomUsers
}