const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: Object, required: true },
});

module.exports = mongoose.model("Chatrooms", chatSchema);
