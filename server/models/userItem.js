const mongoose = require('mongoose');

// Schema for User item
const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  lastname: String,
  password: String,
  email: String,
  occupation: String,
  registered_at: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;