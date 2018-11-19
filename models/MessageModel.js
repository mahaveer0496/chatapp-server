const mongoose = require('mongoose')
const User = require('./UserModel');
const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
})

module.exports = mongoose.model('Message', MessageSchema)
