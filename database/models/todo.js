const mongoose = require('mongoose')
const { Schema } = mongoose;

const todoSchema = new Schema({
  task: String,
  createdBy: String,
  todopic : String
});

const todoModel = new mongoose.model("todo",todoSchema);

module.exports = todoModel;