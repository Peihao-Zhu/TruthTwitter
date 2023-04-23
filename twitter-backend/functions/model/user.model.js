const mongoose = require("mongoose");
// Recall how exports work in Node.js?
const UserSchema = require("./user.schema").UserSchema;

// Here we are mapping our UserSchema to the model User.
// If we are interested in referencing the User model elsewhere,
// we can simply do mongoose.model("User") elsewhere
const UserModel = mongoose.model("User", UserSchema);

function insertUser(User) {
  return UserModel.create(User);
}

function getAllUser() {
  return UserModel.find().exec();
}
// Note the difference between the find above and below.
// Above, this is finding pretty ALL documents
// Below is finding all the documents that match this
// constraint
function findUserByUsername(username) {
  return UserModel.findOne({
    $or: [{ email: username }, { username: username }],
  }).exec();
}

function findUserById(id) {
  return UserModel.findById(id).exec();
}

function updateUserById(id, User) {
  const userKeys = Object.keys(User);
  const data = {};
  userKeys.map((key) => {
    data[key] = User[key];
    // console.log(key + ' ' + User[key])
  });
  return UserModel.updateOne({ _id: id }, data).exec();
}

// currently keyword will only search username
function findUserByKeyword(keyword) {
  const regex = new RegExp(keyword, "i");
  return UserModel.find({ username: regex }).exec();
}

// Make sure to export a function after you create it!
module.exports = {
  insertUser,
  findUserByUsername,
  getAllUser,
  findUserById,
  updateUserById,
  findUserByKeyword,
};
