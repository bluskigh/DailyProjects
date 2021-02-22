// from flask import Flask
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const session = require("express-session");
const mongoose = require("mongoose");
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
  // will store gifs here.

  // fetch("https://api.giphy.com/v1/gifs/trending?api_key=Do2KvcrIdYyuEJWNE7dKQ7CNOdEYc7Wp&limit=5&")
  // .then( async (r) => {
  //   // awaiting the promise to be fulfilled, so I can get the full data from the server.
  //   let data = await r.json();
  //   // extracting the actual data array from the response
  //   //
  //   data = data.data; 

  //   for (const item of data)
  //   {
  //     const info = {
  //       imageUrl: item.images.original.url,
  //       imageHeight: item.images.original.height,
  //       imageWidth: item.images.original.width,
  //       gifTitle: item.title,
  //     };

  //     let isFav = await FavoriteModel.find({title: info.gifTitle, width: info.imageWidth, height: info.imageHeight, user_id: user_id});
  //     // console.log("\nIs fav: ", isFav);
  //     if (isFav.length)
  //     {
  //       info.id = isFav[0]._id;
  //       info.checked = true;
  //     }
  //     else
  //     {
  //       info.id = null;
  //       info.checked = false;
  //     }
  //     //console.log("Info: ", info);
  //     RESULT.push(info);
  //   }

  //   // console.log("RESULT: ", RESULT);
  //   res.render("index", {title: "Home", result: RESULT, username: username, favorites: null});
  // })
  // .catch( (e)=>{
  //   console.log(e);
  // });
  res.render("index", {title: "Home", username: username, favorites: null});
});


app.post("/", async (req, res) => {
  const { title } = req.body;
  let RESULT = [];

  fetch("https://api.giphy.com/v1/gifs/search?api_key=Do2KvcrIdYyuEJWNE7dKQ7CNOdEYc7Wp&limit=5&q=" + title)
  .then( async (r) => {
    // awaiting the promise to be fulfilled, so I can get the full data from the server.
    let data = await r.json();
    // extracting the actual data array from the response
    data = data.data; 
    for (const item of data)
    {
      RESULT.push({
        // id: item.id,
        imageUrl: item.images.original.url,
        imageHeight: item.images.original.height,
        imageWidth: item.images.original.width,
        gifTitle: item.title
      });
    }
    res.render("index", {title: "Home", result: RESULT, username: req.session.username, favorites: null});
  })
  .catch( (e)=>{
    console.log(e);
  });
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

  fetch("https://api.giphy.com/v1/gifs/" + type + "?api_key=Do2KvcrIdYyuEJWNE7dKQ7CNOdEYc7Wp&limit=5" + queryString)
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
      let isFav = await FavoriteModel.find({title: info.gifTitle, width: info.imageWidth, height: info.imageHeight, user_id: user_id});
      // if the item was found, then mark as checked (on web, will show hearted), set the info's id to be the current item's id found
      if (isFav.length)
      {
        info.id = isFav[0]._id;
        info.checked = true;
      }
      else
      {
        info.id = null;
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
  UserModel.findOne({username: username, password: password})
  .then( (r)=>{
    if(r)
    {
      // sign the user in...
      req.session.user_id = r._id;
      req.session.username = username;

      // redirect the user to the homepage
      res.redirect("/");
    }
    else
    {
      res.send("That is not in our database");
    }
  }).catch(e=>console.log(e))
});

/////////////////// Sign Up
// if person is trying to get to the sign up page
app.get("/signup", (req, res) => {
  res.render("enterInformation", {title: "Sign Up", login:false, username: req.session.username}); 
});
// if person is trying to sign up, via post requset
app.post("/signup", (req, res) => {
  // validate that the confirmation and the password are the same
  const { username, password, confirmation } = req.body;
  if (password != confirmation)
  {
    res.send("Error...The password and confirmation did not match");
  }
  // check if the username does not exist in the prorgam
  UserModel.findOne({username: username})
  .then( (r)=>{
    if (r)
    {
      res.send("Error.... That username already exist.. Try again please.");
    }
    else
    {
      // does nto exist, so craete the user and redirect as logged in.

      // creating user item, to store in the database
      const tempUser = new UserModel({username: username, password: password});
      // saving to the database
      tempUser.save();

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

app.get("/favorite", (req, res)=>{
  // return an array of objects which contain releveant information 
  FavoriteModel.find({user_id: req.session.user_id})
  .then((r)=>{
    res.render("index", {title: "Favorites", result: null, username: req.session.username, favorites: r});
  })
  .catch(e=>console.log("errrrrrror"));
});

app.post("/favorite", (req, res)=>{
  const { url, title, width, height } = req.body;
  // save to the favorites
  if (url && title && width && height)
  {
    const tempFav = new FavoriteModel({ 
      user_id: req.session.user_id,
      title: title,
      url: url,
      width: width,
      height: height,
    });
    // saving tothe Favorites collection
    tempFav.save();

    res.status(200);
  }
  else
  {
    res.status(409);
  }
});

app.post("/removeFavorite", (req, res)=>{
  const { gif_id } = req.body;
  // find the gif_id in the database
  try
  {
    FavoriteModel.deleteMany({_id: gif_id, user_id: req.session.user_id})
    .then((r)=>{
      if (!r)
      {
        console.log("Error, did not find that.");
      }
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
