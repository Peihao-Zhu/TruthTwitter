const express = require("express");
const router = express.Router();

const UserAccessor = require("../model/user.model");
const TweetAccessor = require("../model/tweet.model");

const bcrypt = require("bcryptjs");
const authParser = require("../auth/auth.helper");
const jwt = require("jsonwebtoken");

router.get("/auth", authParser, (req, res) => {
  return res.sendStatus(200);
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  // search whether the username and password exit in mongodb
  UserAccessor.findUserByUsername(username)
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const payload = { username };
        // JWT is encrypting our payload (which is whatever data we want
        // to carry across sessions: in this case, just the username)
        // into the cookie based on our SECRET
        const token = jwt.sign(payload, process.env.SUPER_SECRET, {
          expiresIn: "14d", // optional cookie expiration date
        });
        // Here we are setting the cookie on our response obect.
        // Note that we are returning the username, but that isn't as necessary anymore
        // unless we want to reference that on the frontend
        return res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .status(200)
          .send(user);
      } else res.status(404).send("username or password wrong");
    })
    .catch((error) => console.error(`Something went wrong: ${error}`));
});

router.get("/logout", (req, res) => {
  res.clearCookie().status(200).send("logout successfully");
});

router.post("/signup", (req, res) => {
  const data = req.body;
  if (!data.username || !data.password) {
    return res
      .status(404)
      .send({ message: "Must include username AND password" });
  }

  data["profileImage"] =
    "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=996&t=st=1680413689~exp=1680414289~hmac=09994e8b8d18d554dfba6d1115b9aec238f478be6b79aa35dec2d618c9646573";

  // HERE: we are  replacing the password.  We can make the salt (the 10)
  // more complex, but this is fine in our case
  data.password = bcrypt.hashSync(req.body.password, 10);
  UserAccessor.insertUser(data).then(
    (response) => res.status(200).send(response),
    (error) => res.status(404).send(`Error finding User:${error}`)
  );
});

// router.get("/all", function (req, res) {
//   UserAccessor.getAllUser().then(
//     (response) => res.status(200).send(response),
//     (error) => res.status(404).send(`Error finding User:${error}`)
//   );
// });

router.get("/search", function (req, res) {
  UserAccessor.findUserByKeyword(req.query.keyword)
    .then((response) => res.status(200).send(response))
    .catch((error) => console.error(`Something went wrong: ${error}`));
});

router.get("/:userId", function (req, res) {
  UserAccessor.findUserById(req.params.userId)
    .then((response) => res.status(200).send(response))
    .catch((error) => console.error(`Something went wrong: ${error}`));
});

/**
 * if successful, return new info about the user
 */
router.put("/:userId/profile", authParser, function (req, res) {
  UserAccessor.findUserById(req.params.userId)
    .then((user) => {
      if (user) {
        UserAccessor.updateUserById(req.params.userId, req.body).then(() => {
          // check if username or image changed
          const data = {};
          if (user.profileImage !== req.body.profileImage)
            data["userImage"] = req.body.profileImage;
          if (user.username !== req.body.username)
            data["username"] = req.body.username;
          if (Object.keys(data).length !== 0)
            // we should try to update all tweets posted by this user if he/she change the image or usernam
            TweetAccessor.updateTweetByUserId(req.params.userId, data).catch(
              (error) => res.status(404).send(`Error update tweets :${error}`)
            );
          res.status(200).send(req.body);
        });
      } else {
        res.status(404).send("Cannot find the User");
      }
    })
    .catch((error) => console.error(`Something went wrong: ${error}`));
});

module.exports = router;
