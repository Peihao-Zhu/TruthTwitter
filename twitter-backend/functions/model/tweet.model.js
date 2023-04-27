const mongoose = require("mongoose");
// Recall how exports work in Node.js?
const TweetSchema = require("./tweet.schema").TweetSchema;

// Here we are mapping our TweetSchema to the model Tweet.
// If we are interested in referencing the Tweet model elsewhere,
// we can simply do mongoose.model("Tweet") elsewhere
const TweetModel = mongoose.model("Tweet", TweetSchema);

function insertTweet(Tweet) {
  return TweetModel.create(Tweet);
}

function getAllTweet() {
  return TweetModel.find().sort({ createdAt: -1 }).exec();
}

function findTweetByUserId(userId) {
  return TweetModel.find({
    userId: userId,
  })
    .sort({ createdAt: -1 })
    .exec();
}

function findTweetById(id) {
  return TweetModel.findById(id).exec();
}

function deleteTweetById(id) {
  return TweetModel.deleteOne({ _id: id }).exec();
}

function updateTweetById(id, Tweet) {
  const TweetKeys = Object.keys(Tweet);
  const data = {};
  TweetKeys.map((key) => {
    data[key] = Tweet[key];
  });
  return TweetModel.updateOne({ _id: id }, data).exec();
}

function updateTweetByUserId(userId, data) {
  return TweetModel.updateMany({ userId: userId }, { $set: data }).exec();
}

// Make sure to export a function after you create it!
module.exports = {
  insertTweet,
  findTweetByUserId,
  getAllTweet,
  findTweetById,
  updateTweetById,
  deleteTweetById,
  updateTweetByUserId,
};
