const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
module.exports.createUser = (username, password)=>{
  return new Promise(async (resolve, reject)=>{
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // create the user
    const temp = new UserModel({username: username, password: hash});
    // save new user to the database
    temp.save();
    console.log(temp);
    // return id to the user
    resolve(temp._id);
  });
};
