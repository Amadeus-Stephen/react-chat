const express = require("express");
const User = require("../models/Users.js");
const router = express.Router();

router.get("/", function (req, res) {
  User.find()
    .then((data) => {
        const prom = new Promise((resolve) => { 
            let listofusers = []
            data.map(i =>{
                listofusers.push(i.username) 
            })
            resolve(listofusers)
        })
        prom.then((data) => {
            res.json(data)
        })
        
    })
    .catch((err) => res.status(400).json("Error: " + err));})

router.get("/:username/:password", function (req , res) {
  User.find({username:req.params.username , password: req.params.password})
  .then((user) => res.json(user))
  .catch(err => res.status(400).json("Error: "+ err))
})

router.post("/create", function (req, res) {
  User.create({ username: req.body.username , password: req.body.password})
    .then(() => {
        res.json("user added:")
      }
    )
    .catch((err) => res.status(400).json("400"));
});
router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.username = req.body.username;
 
      user
        .save()
        .then(() => res.json("user updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
router.get("/:id", function(req, res) {
  User.findById(req.params.id)
  .then((user) => res.json(user))
  .catch((err) => res.status(400).json(`error ${err}`))
})
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('user deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;