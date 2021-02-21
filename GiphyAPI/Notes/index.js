const express = require("express");
const session = require("express-session");
const app = express();

// TODO: look up what middleware is

// going to want this to be an actual secret, env variable
const sessionOptions = { secret: "dailyProject", resave: false, saveUninitialized: false};
app.use(session(sessionOptions));

// on our req object, we are going to have a secret available
//
app.get("/viewcount", (req, res) => {
  // id(cookie): 
  // can add anything that you want to the session. it is stored server side
  if (req.session.count)
  {
    req.session.count+=1;
  }
  else
  {
    req.session.count=1;
  }
  res.send("You have viewed this page : "+req.session.count);
});

// default store, is in memory store.
// we can specifify different storage. example mongo contains a session store

app.listen(3000, ()=>console.log("Listening on port 3000"));
