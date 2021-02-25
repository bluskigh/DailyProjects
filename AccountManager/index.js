const express = require("express");
const path = require("path");
const Auth = require("./Auth");
const session = require("express-session");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(Auth);
app.use(session({secret: "makebettersecret"}));

//////////////////////////// Not signed in routes
app.get("/", (req, res)=>{
  if (req.session.user_id)
  {
    res.redirect("/home");
  }
  else
  {
    res.render("index", {styleLocation: "css/index.css", title: "Account Manager", signUp: false, logIn: false, home: false});
  }
});

//////////////////////////// Signed in routes 
app.get("/home", (req, res)=>{
  if (req.session.user_id)
  {
    res.render("home", {styleLocation: "css/home.css", title: "Home", signUp: false, logIn: false, home: true});
  }
  else
  {
    res.redirect("/");
  }
});

//////////////////////////// Contact routes 

// listener
app.listen(3000, ()=>{console.log("Listening on port 3000")});
