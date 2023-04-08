// We are using the Schema Class here
// This allows us to declare specifically what is IN the
// document and what is not
const Schema = require('mongoose').Schema

exports.UserSchema = new Schema(
  {
    // mongoose automically gives this an _id attribute of ObjectId
    email: String,
    username: String,
    password: String,
    bio: String,
    website: String,
    profileImage: String,
    createDate: {
      type: Date,
      default: Date.now,
    },
    // this explicitly declares what collection we're using
  },
  { collection: 'users' },
)
