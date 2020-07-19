const express = require("express");
const DirectMessages = require("../models/DirectMessages.js");
const router = express.Router();

//create
router.post("/create", function (req, res) {
  DirectMessages.create({users:req.body.users, logs:req.body.logs})
    .then(() => res.json("direct added:"))
    .catch((err) => res.status(400).json("Error: " + err));
});
//post to direct

router.get("/" , (req, res)=> {
  DirectMessages.find()
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.status(400).json(`Error ${err}`)
  })
})

router.route("/post/:id").post((req, res) => {
    DirectMessages.findById(req.params.id)
    .then((direct) => {
      let newMsessage = {msg: req.body.msg , user:req.body.user}
      direct.logs.push(newMsessage)
  
      direct
        .save()
        .then(() => res.json("message added"))
        .catch((err) => res.status(400).json("Error: "+ err))
    })
    .catch((err) => res.status(400).json("Error: " + err));
})

router.get("/:id", function(req, res) {
  DirectMessages.findById(req.params.id)
  .then((data) => res.json(data))
  .catch((err) => res.status(400).json(`error ${err}`))
})

//gets the list of all users
router.get("/directmessages/:user", function (req , res) {
    DirectMessages.find()
    .then((data) => {
        const prom = new Promise((resolve) => {
            const datalist = []
            data.map(i => {
              if (i.users.includes(req.params.user)) {
                datalist.push(i)
              }
            })
       
            resolve(datalist)
        })
        prom.then((data) => {
            res.json(Array.from(data))
    })})
    .catch(err => res.status(400).json("Error: "+ err))
})
//delete chat
router.route('/:id').delete((req, res) => {
  DirectMessages.findByIdAndDelete(req.params.id)
    .then(() => res.json('direct deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;