const mongoose = require('mongoose');

module.exports = function()
{
  mongoose.connect('mongodb+srv://_<TYPE cred>_/?retryWrites=true&w=majority')
  .then(function()
  {
    console.log("connected to db");
  })
  .catch(function()
  {
    console.log("db connection error")
  })
}
