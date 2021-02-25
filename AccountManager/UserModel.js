const mongoose = require("mongoose");
// connect to the local database
mongoose.connect("mongodb://localhost:27017/accountManagerApp", {useUnifiedTopology: true, useNewUrlParser: true} )
.then((r)=>{
  console.log("Connected to the database, accountManagerApp");
}).catch(e=>{console.error(e)});

// create schema for the user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accounts: {
    type: Number,
    min: 0,
    max: 100
  }
});

const UserModel = new mongoose.model("Users", UserSchema);

module.exports.model = UserModel;
// TODO: add auth's here
// TODO: DOING: sign up functionality
// TODO: add login functionality

