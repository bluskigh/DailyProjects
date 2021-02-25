const express = require("express");
const path = require("path");
const Auth = require("./Auth");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(Auth);

// route handlers
app.get("/", (req, res)=>{
  res.render("index");
});

// listener
app.listen(3000, ()=>{console.log("Listening on port 3000")});
