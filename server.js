'use strict'
// Packages-----
const Inert = require('inert')
const Hapi = require('hapi')
const mongoose = require('mongoose')

// Models------
const User = require('./models/UserModel')
const Message = require('./models/MessageModel')

// Utils-------
const socketIO = require('./socketIo')
mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost:27017/chatapp',
  { useNewUrlParser: true }
)
const server = Hapi.server({
  host: 'localhost',
  port: 4000,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

const IO = require('socket.io')(server.listener)
async function start() {
  try {
    // await server.register([
    //   Inert
    //   // {
    //   //   plugin: require('hapi-pino'),
    //   //   options: {
    //   //     prettyPrint: true,
    //   //     logEvents: ['response', 'onPostStart']
    //   //   }
    //   // }
    // ])
    await server.start()
  } catch (err) {
    // console.log(err)
    process.exit(1)
  }
  // process.stdout.write('\x1B[2J')
  console.log('Server running at:', server.info.uri)
}

start()

server.route({
  method: 'POST',
  path: '/api/login',
  handler: async function(request, h) {
    const { payload } = request
    let user = await User.findOne({ name: payload })
    if (!user) {
      user = await User.create({ name: payload })
      return { payload: user.name }
    }
    return { error: 'User name taken' }
  }
})

server.route({
  method: 'GET',
  path: '/api/chat',
  handler: function(request, h) {
    return 'boooyaa'
  }
})

socketIO(IO)