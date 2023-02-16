const express = require("express");
const router = express.Router();
const { auth } = require("../utils/auth");
const User = require("../schemas/User.schema");

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  console.log(username, password, confirmPassword);

  if (password !== confirmPassword) {
    res.send("Passwords do not match");
    return;
  }

  User.findOne(
    {
      username: username,
    },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.send("User already exists");
        return;
      }

      const user = new User({ username, password, confirmPassword });
      await user.save((err, doc) => {
        if (err) throw err;
        res.send("User registered");
      });
    }
  );
});

router.post("/login", async (req, res) => {
  let token = req.cookies.token;

  if (token) {
    User.findByToken(token, (err, user) => {
      if (err) throw err;
      console.log(user);
      if (user) {
        res.status(200).send("You are already logged in");
      }
    });
    return;
  }

  const { username, password } = req.body;
  console.log(username, password);
  console.log("------------");
  User.findOne(
    {
      username: username,
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.send("User does not exist");
        return;
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          res.send("Incorrect password");
          return;
        }

        user.generateToken((err, user) => {
          if (err) throw err;
          res.cookie("token", user.token).json({
            auth: true,
            token: user.token,
            id: user._id,
            username: user.username,
          });
          return;
        });
      });
    }
  );
});

router.get("/profile", auth, (req, res) => {
  res.send(req.user);
});

router.get("/logout", auth, (req, res) => {
  console.log(req.user);
  req.user.deleteToken(req.token, (err, user) => {
    if (err) throw err;
    res.clearCookie("token");
    res.send("Logged out");
  });
});

module.exports = router;
