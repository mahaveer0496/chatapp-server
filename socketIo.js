const IO = require('./server')
let numUsers = 0
IO.on('connection', socket => {
  numUsers++
  console.log(`users connected ${numUsers}`)
  socket.on('newMessage', data => {
    console.log(data)
  })
})
module.exports = socket => {}
