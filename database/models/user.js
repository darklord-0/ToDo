const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type: String},
  password: String
});

const userModel = new mongoose.model("user",userSchema);

module.exports = userModel;