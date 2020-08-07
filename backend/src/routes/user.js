const express = require("express");
const router = express.Router();
const User = require("../database/models/user");
const passport = require("passport");

router.post("/", (req, res) => {
  console.log("user signup");

  const { username, email, password, confirmPassword } = req.body;
  // ADD VALIDATION
  if (!username || !email || !password || !confirmPassword) {
    res.json({ error: { msg: "Please fill in the entire form" } });
  } else if (password !== confirmPassword) {
    res.json({ error: { msg: "Passwords do not match" } });
  } else if (password.length < 6) {
    res.json({
      error: { msg: "Your password needs to be six characters long" },
    });
  } else {
    User.findOne({
      $or: [{ email }, { username }],
    })
      .then((user) => {
        if (user) {
          if (user.username === username) {
            res.json({ error: { msg: "Username is already taken" } });
          }
          if (user.email === email) {
            res.json({ error: { msg: "email is already signed up" } });
          } else {
            console.log(
              `Error , mongo returned user but did not match given params : ${user}`
            );
          }
        } else {
          const newUser = new User({
            username,
            email,
            password,
          });
          newUser.save((err, savedUser) => {
            if (err) return res.json(err);
            res.json(savedUser);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (e, user, info) => {
    if (info) {
      console.log(`Error: ${info.message}`);
      let error = { msg: info.message };
      return res.send({ error });
    } else {
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log(user);
      });
      res.send(user);
    }
  })(req, res, next);
});
// will login user in if already pass authentication
router.get("/", (req, res, next) => {
  console.log("===== user!!======");
  console.log(req.user);
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// returns all active users - get rid of this in post production
// or atleast lock it behind a password
router.get("/list", (req, res) => {
  User.find().then((data) => {
    res.json(data);
  });
});
// deletes user by given http req param id - again get rid of this in post or lock it

// logs user out of the express / passport session
router.post("/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ msg: "logging out" });
  } else {
    res.send({ msg: "no user to log out" });
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("deleted user");
    })
    .catch((err) => {
      res.json(`Error: ${err}`);
    });
});
module.exports = router;
