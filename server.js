'use strict'

const Inert = require('inert')
const Hapi = require('hapi')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27019/chatapp')
const User = require('./models/UserModel')

const server = Hapi.server({
  host: 'localhost',
  port: 4000,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})
const io = require('socket.io')(server.listener)
async function start() {
  try {
    await server.register([
      Inert,
      {
        plugin: require('hapi-pino'),
        options: {
          prettyPrint: true,
          logEvents: ['response', 'onPostStart']
        }
      }
    ])
    await server.start()
  } catch (err) {
    // console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()

server.route({
  method: 'POST',
  path: '/api/login',
  handler: function(request, h) {
    const { payload } = request
    console.log(payload)
    return 'boooyaa'
  }
})

server.route({
  method: 'GET',
  path: '/api/chat',
  handler: function(request, h) {
    return 'boooyaa'
  }
})

io.on('connection', socket => {
  socket.on('chat', data => {
    console.log(data)
    io.emit('chatReturn', data)
  })
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected')
  })
})
