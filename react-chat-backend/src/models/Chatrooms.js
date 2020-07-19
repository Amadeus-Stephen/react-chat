const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    chatroom: { type: String, required: true },
    owner: {type:String,required:true},
    logs : {type:Array, required:true}
  } 
)

module.exports = mongoose.model("Chatrooms", chatSchema)