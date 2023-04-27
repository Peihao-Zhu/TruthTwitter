// We are using the Schema Class here
// This allows us to declare specifically what is IN the
// document and what is not
const Schema = require("mongoose").Schema;

exports.TweetSchema = new Schema(
  {
    // mongoose automically gives this an _id attribute of ObjectId
    userId: String,
    username: String,
    userImage: String,
    content: String,
    fileURL: String,
    // Mongoose will help us maintain createAt and updateAt and the latter one will be updated every time we edit the document
  },
  { collection: "tweets", timestamps: true }
);
