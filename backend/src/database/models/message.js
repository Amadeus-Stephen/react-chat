const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: { type: String, required: true },
  user: { type: Object, required: true },
  msg: { type: String, required: true },
});

module.exports = mongoose.model("Message", messageSchema);
