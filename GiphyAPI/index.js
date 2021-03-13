// from flask import Flask
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// app = Flask(__name__);
const app = express();

mongoose.connect("mongodb://localhost:27017/gifApp", {useNewUrlParser: true, useUnifiedTopology: true})
.then( (r) => {
  console.log("connected to the databse");
})
.catch(e=>console.log(e));

// Gif schema
const gifSchema = new mongoose.Schema({
  user_id: Object,
  title: String,
  url: String,
  width: Number,
  height: Number
});
const FavoriteModel = new mongoose.model("Favorites", gifSchema);

// user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const UserModel = new mongoose.model("Users", userSchema);

// formatting is ejs, not jinja, not pug... EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// static folder, contains js and css, possibly images too. In this case its convention to name is public
app.set("trust proxy", 1);
app.use(session({
  secret: "dailyproject",
  resave: false,
  saveUninitialized: true,
}))

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());

app.get("/", async (req, res) => {
  const { username } = req.session;
  res.render("index", {title: "Home", username: username, favorites: null});
});


app.get("/getSomething/:query", (req, res)=>{
  const { query } = req.params;
  const { user_id } = req.session;
  let queryString = "&q=" + query;
  let type = "search";
  if (query==="trending")
  {
    type="trending";
    queryString = "";
  }

  fetch("https://api.giphy.com/v1/gifs/" + type + "?api_key=Do2KvcrIdYyuEJWNE7dKQ7CNOdEYc7Wp&limit=10" + queryString)
  .then( (r)=>r.json())
  .then( async (r)=>{
    let RESULT = [];
    for (const item of r.data)
    {
      // saving the current information 
      let info = {
        url: item.images.original.url,
        height: item.images.original.height,
        width: item.images.original.width,
        title: item.title,
      };

      // checking if the current item is part of the users favorites
      let isFav = await FavoriteModel.find({title: info.title, width: info.width, height: info.height, user_id: user_id});
      // if the item was found, then mark as checked (on web, will show hearted), set the info's id to be the current item's id found
      if (isFav.length)
      {
        info._id = isFav[0]._id;
        info.checked = true;
      }
      else
      {
        info._id = null;
        info.checked = false;
      }

      // push onto the result array (the current info object, which contains all the information)
      RESULT.push(info);
    }

    res.send(JSON.stringify({result: RESULT}));
  })
  .catch( (e)=>{
    console.log(e);
  });
});

///////////////// Log IN
// trying to get to the login page
app.get("/login", (req, res) => {
  res.render("enterInformation", {title: "Log In", login: true, username: req.session.username});
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // TODO: figure out how to hash the password, and unhas to check
  // check if the user exists
  UserModel.findOne({username: username})
  .then(async (r)=>{
    if(r)
    {
      if (await bcrypt.compare(password, r.password)) {
        // sign the user in...
        req.session.user_id = r._id;
        req.session.username = username;

        // redirect the user to the homepage
        res.redirect("/");
      } else {
        console.log("the password did not match");
      }
    }
    else
    {
      res.render("error", {message: "Invalid username and password"});
    }
  }).catch(e=>console.log(e))
});

/////////////////// Sign Up
// if person is trying to get to the sign up page
app.get("/signup", (req, res) => {
  res.render("enterInformation", {title: "Sign Up", login:false, username: req.session.username}); 
});
// if person is trying to sign up, via post requset
app.post("/signup", async (req, res) => {
  // validate that the confirmation and the password are the same
  const { username, password, confirmation } = req.body;
  if (password != confirmation)
  {
    res.render("error", {message: "The password and confirmation did not match."});
  }
  // check if the username does not exist in the prorgam
  UserModel.findOne({username: username})
  .then( async (r)=>{
    if (r)
    {
      res.render("error", {message: "That username already exist..."});
    }
    else
    {
      // does nto exist, so craete the user and redirect as logged in.

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // creating user item, to store in the database
      const tempUser = new UserModel({username: username, password: hash});
      // saving to the database
      await tempUser.save();

      // storing the users information in the session (cookie?) so that I can use it while he is using the application
      req.session.user_id = tempUser._id;
      req.session.username = username;

      // now redirect the user
      res.redirect("/");
     }
    })
  .catch(e=>console.log(e))
});

//////////////// Sign Out
app.get("/signout", (req, res)=>{
  // signing out the user, same as session.clear() from Flask
  req.session.destroy();
  // redirect the user back to the main page
  res.redirect("/");
});

let favorites = [];

app.get("/favorite", (req, res)=>{
  // return an array of objects which contain releveant information 
  if (req.session.user_id)
  {
    FavoriteModel.find({user_id: req.session.user_id})
    .then((r)=>{
      favorites = r;
      res.render("index", {title: "Favorites", result: null, username: req.session.username, favorites: r});
    })
    .catch(e=>console.log("errrrrrror"));
  }
  else
  {
    res.render("error", {message: "You're not supposed to be here..."});
  }
});


app.post("/favorite", (req, res)=>{
  const { url, title, width, height } = req.body;
  // save to the favorites
  // make sure that a title and url of this kind is not already available for the user
  // for now we are assuming that the title and width and height are the identifiers for a gif, though many identifiers can be used, such as url, id, and more.
  let exist = false;
  FavoriteModel.find({title: title, width: width, height: height})
  .then( (r)=>{
    if (r.length)
    {
      exist = true;
    }

    // if the todo is not in our favorites, and valid values where given.
    if (url && title && width && height && req.session.user_id && !exist)
    {
      // create item from model
      const tempFav = new FavoriteModel({ 
        user_id: req.session.user_id,
        title: title,
        url: url,
        width: width,
        height: height,
      });
      // saving tothe Favorites collection
      tempFav.save();
    }
  }).catch(e=>console.log("error", e));

  });

app.get("/getFavorites", (req, res)=>{
  if (favorites)
  {
    // assuming that the user did not try to hack around this, by default the favorite path is going to run, which fills this favorites array for us.
    // get all the favorites, and return them back in an array for the user to loop over
    res.send(JSON.stringify(favorites));
  }
  else
  {
    res.render("error", {message: "Hmmm... Something went wrong with loading your favorites :/"});
  }
});

app.post("/removeFavorite", (req, res)=>{
  const { gif_id } = req.body;
  // find the gif_id in the database
  console.log("Gif id: ", gif_id);
  try
  {
    FavoriteModel.deleteMany({_id: gif_id, user_id: req.session.user_id})
    .then((r)=>{
      if (!r)
      {
        console.log("Error, did not find that.");
      }
      res.send(JSON.stringify({success: true}));
    })
    .catch(e=>console.error(e));
  }catch(e){
    console.log(e);
  }
});

// If all else fails...
app.get("*", (req, res) => {
  res.send("That does not exist....");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
