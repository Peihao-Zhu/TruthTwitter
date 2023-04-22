const express = require("express");
const router = express.Router();

const UserAccessor = require("../model/user.model");
const TweetAccessor = require("../model/tweet.model");

router.post("/signin", (req, res) => {
  const data = req.body;
  // search whether the username and password exit in mongodb

  UserAccessor.findUser(data.username, data.password).then(
    (response) => {
      if (response === null) {
        res.status(404).send("username or password error");
      }
      // console.log('find user ' + response)
      else res.status(200).send(response);
    },
    (error) => res.status(404).send(`Error finding User:${error}`)
  );
});

router.post("/signup", (req, res) => {
  // NOTE: because we're using Mongoose, it will
  // filter out any data that we DON'T want
  // So we can safely pass it the entire body
  const data = req.body;
  if (!("profileImage" in data)) {
    data["profileImage"] =
      "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=996&t=st=1680413689~exp=1680414289~hmac=09994e8b8d18d554dfba6d1115b9aec238f478be6b79aa35dec2d618c9646573";
  }
  UserAccessor.insertUser(data).then(
    (response) => res.status(200).send(response),
    (error) => res.status(404).send(`Error finding User:${error}`)
  );
});

router.get("/all", function (req, res) {
  UserAccessor.getAllUser().then(
    (response) => res.status(200).send(response),
    (error) => res.status(404).send(`Error finding User:${error}`)
  );
});

router.get("/:userId", function (req, res) {
  UserAccessor.findUserById(req.params.userId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(404).send(`Error finding User:${error}`));
});

/**
 * if successful, return new info about the user
 */
router.put("/:userId/profile", function (req, res) {
  UserAccessor.findUserById(req.params.userId).then((user) => {
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
          TweetAccessor.updateTweetByUserId(req.params.userId, data)
            .then(() => res.status(200).send(req.body))
            .catch((error) =>
              res.status(404).send(`Error update tweets :${error}`)
            );
      });
    } else {
      res.status(404).send("Cannot find the User");
    }
  });
});

module.exports = router;
