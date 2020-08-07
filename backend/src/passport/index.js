const LocalStrategy = require("passport-local").Strategy;

const User = require("../database/models/user"); //gets the user model

module.exports = (passport) => {
  passport.use(
    // defines localstrategy used in the post request routes
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        User.findOne({ username }) // finds the email on login post request
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "user does not exist" });
            }
            if (!user.checkPassword(password)) {
              return done(null, false, { message: "incorrect password" });
            } else {
              return done(null, user);
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    //incrypt
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // decrypt
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
