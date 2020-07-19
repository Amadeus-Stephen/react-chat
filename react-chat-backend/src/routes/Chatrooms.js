const express = require("express");
const Chatrooms = require("../models/Chatrooms.js");
const router = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// gets all chat rooms
router.get("/", jsonParser,function (req, res) {
  Chatrooms.find()
    .then((chatroom) => res.json(chatroom))
    .catch((err) => res.status(400).json("Error: " + err));
});
//creates chat room
router.post("/create", jsonParser, function (req, res) {
  console.log(req.body)
  Chatrooms.create({chatroom: req.body.chatroom , owner:req.body.owner, log:req.body.log})
    .then(() => res.json("Chatroom added:"))
    .catch((err) => res.status(400).json("Error: " + err));
});
//update chat room name
router.post("/update/:id", jsonParser,function (req, res)  {
  Chatrooms.findById(req.params.id)
    .then((chatroom) => {
      chatroom.chatroom = req.body.chatroom;
 
      chatroom
        .save()
        .then(() => res.json("chatroom updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//log new msg to chatroom
router.post("/post/:id" , jsonParser ,  function (req, res)  {
  Chatrooms.findById(req.params.id)
  .then((chatroom) => {
    chatroom.logs.push({msg: req.body.msg , user:req.body.user})
    chatroom
      .save()
      .then(() => res.json("message added"))
      .catch((err) => res.status(400).json("Error: "+ err))
  })
  .catch((err) => res.status(400).json("Error: " + err));
})
//find chatroom by name
/*
router.get("/:chatroom" , function(req, res) {
  Chatrooms.find({chatroom: req.params.chatroom})
  .then((chatroom) => res.json(chatroom))
  .catch((err) => res.status(400).json(`error ${err}`))
})
*/
router.get("/:id", jsonParser , function(req, res) {
  Chatrooms.findById(req.params.id)
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json(`error ${err}`))
})

// delete chatroom
router.delete('/:id' , jsonParser, function (req, res)  {
  Chatrooms.findByIdAndDelete(req.params.id)
    .then(() => res.json('Chatroom deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;