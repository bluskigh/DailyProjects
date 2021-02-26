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
    max: 100,
    default: 0
  }
});

const ChildSchema = new mongoose.Schema({
  parent_id: {
    type: Object,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 10
  }
});

const NoteSchema = new mongoose.Schema({
  parent_id: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 10
  }, 
  date: {
    type: Date,
    default: Date.now
  }
});

const ChildModel = new mongoose.model("Childs", ChildSchema);
const NoteModel = new mongoose.model("Notes", NoteSchema);
const UserModel = new mongoose.model("Users", UserSchema);

const hash = (password)=>{
  return new Promise(async (resolve, reject)=>{
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // create the user
    resolve(hash);
  });
};

const create = (Model, username, password)=>{
  return new Promise(async (resolve, reject)=>{
    hash(password)
    .then((r)=>{
      // create the user
      const temp = new Model({username: username, password: hash});
      // save new user to the database
      temp.save();
      console.log(temp._id);
      // return id to the user
      resolve(temp._id);
    })
    .catch((e)=>{
      reject(e);
    })
  });
};

//////////////////////// module exports
///// Creation
module.exports.model = UserModel;
// to create a (manager)
module.exports.createUser = (username, password)=>{
  return new Promise(async (resolve, reject)=>{
    hash(password)
    .then((r)=>{
      // result is the hashed password
      const temp = new UserModel({username: username, password: hash});
      temp.save();
      resolve(temp._id);
    })
    .catch((e)=>{
      reject(e);
    })
  });
};
// to create a child 
module.exports.createChild = (username, password, parent_id)=>{
  return new Promise(async (resolve, reject)=>{
    hash(password)
    .then((r)=>{
      const temp = new ChildModel({username: username, password: hash, parent_id: parent_id});
      temp.save();
      console.log("Saved the child, ", temp._id); 
      resolve(temp._id);
    })
    .catch((e)=>{
      reject(e);
    })
  });
};

//// Methods
module.exports.login = (username, password)=>{
  return new Promise((resolve, reject)=>{
    UserModel.findOne({username})
    .then(async (r)=>{
      if (r)
      {
        // get the password
        const hashed = r.password;
        try{
          // compare the password given with the hashed one in the database 
          const result = await bcrypt.compare(password, hashed);
          console.log("Result: ", result);
          if (result)
          {
            // the password was correct, return id, to keep the user logged in.
            resolve(r._id);
          }
          else
          {
            // the pasword was incorrect
            reject({message: "Incorrect password", status: 404});
          }
        }catch(e){
          // if some error occured int he bcyrpt compare, this will run
          reject(e);
        }
      }
      else
      {
        reject({message: "Could not find user with \"" + username + "\" in our database", status: 404}); 
      }
    })
  });
};
