const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ApplicationError = require("../secondary/ApplicationError");
mongoose.connect("mongodb://localhost:27017/quizGame")
.then((r)=>{
  console.log("Connected to database");
}).catch((e)=>{console.error(e)});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserModel = new mongoose.model("User", UserSchema);

const encrypt = (password)=>{
  return new Promise(async (resolve, reject)=>{
    // little exrta encrypt time to be added with salt
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports.addUser = (username, password)=>{
  return new Promise(async (resolve, reject)=>{
    // make sure that user does not exist.
    try {
      // checking the database if the user with the given username exists
      const isInDB = await UserModel.exists({username: username});
      if (!isInDB) {
        // if the username is available
        // hash the password
        const hash = await encrypt(password);
        // insert into the datbase
        const temp = new UserModel({username: username, password: hash});
        await temp.save();
        // return the newly created users id 
        resolve(temp._id);
      } else {
        // was not available, let the user know.
        reject(new ApplicationError(username + " username is already taken", 404, "signup"));
      }
    } catch(e) {
      // reject any errors so our error handler can display.
      reject(e);
    }
  });
}
module.exports.deleteUser = (id) => {
  return new Promise(async (resolve, reject)=>{
    try {
      await UserModel.deleteOne({_id: id});
      resolve(true);
    } catch(e) {
      reject(e);
    }
  });
};
// TODO: implemenet updating the user, for now it is not needed.
module.exports.login = (username, password)=> {
  return new Promise(async (resolve, reject)=>{
    const isInDB = await UserModel.exists({username: username});
    if (isInDB) {
      // get the password, compare with given 
      try {
        const result = await UserModel.findOne({username});
        const hashed = result.password;
        const same = await bcrypt.compare(password, hashed);
        if (same)
          resolve(result._id);
        else 
          reject(new ApplicationError("Invalid password", 404, "/login"));
      } catch(e) {
        reject(e);
      }
    } else {
      reject(new ApplicationError(username + " does not exist", 404, "/login"));
    }
  });
};
