const User = require('./models/UserModel')
const Message = require('./models/MessageModel')
module.exports = function(io) {
  let numUsers = 0

  const connectedUsers = {}

  io.on('connection', async socket => {
    numUsers++

    let paginationCounter = 0

    socket.on('getAllMessages', async limit => {
      const storedMessage = await Message.find()
        .skip(paginationCounter * limit)
        .limit(limit)
        .sort({ createdAt: -1 })

      const messages = storedMessage.length ? storedMessage : []
      socket.emit('getAllMessages', messages)
      paginationCounter++
    })

    socket.on('newMessage', async data => {
      const { message, username } = data
      socket.username = username
      const options = { name: username }
      const { name, _id: userId } =
        (await User.findOne(options)) || (await User.create(options))

      const { text, _id, createdAt } = await Message.create({
        text: message,
        createdBy: userId
      })

      const content = {
        text,
        name,
        _id,
        createdAt
      }
      io.emit('newMessage', content)
    })

    socket.on('disconnect', function() {
      numUsers--
      console.log(`users connected ${numUsers}`)
      io.emit('user disconnected')
    })
  })
}
