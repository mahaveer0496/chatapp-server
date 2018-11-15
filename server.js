'use strict'

const Inert = require('inert')
const Hapi = require('hapi')

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
  method: 'GET',
  path: '/chat',
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
