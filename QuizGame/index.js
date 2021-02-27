const express = require("express");
const ApplicationError = require("./secondary/ApplicationError");
const DeckModel = require("./models/DeckModel");
const UserModel = require("./models/UserModel");
const session = require("express-session");
const path = require("path");
const app = express();

app.use(session({secret: "secret"}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());

const isIn = (array, item)=>{
  for (const i of array)
  {
    if (i === item)
      return true;
  }
  return false;
};

const getChoices = (available, right)=>{
  // get all wrong answers
  let wrongs = [];
  for (let i = 0; i < 3; i++)
  {
    let current = null;
    while (true)
    {
      // if the current number is equal to the correct and in the already selected, then keep trying to get another one
      const random = Math.floor(Math.random() * (available.length));
      current = available[random];
      if (!isIn(wrongs, current) && current != right) 
      {
        break;
      }
    }
    wrongs.push(current);
  }

  const rightIndex = Math.floor(Math.random() * 4);
  wrongs.splice(rightIndex, 0, right);
  
  // push the right randomly
  return wrongs;
};
app.get("/", (req, res)=>{
  res.render("index", {user_id: req.session.user_id});
});

app.get("/getQuestions", (req, res)=>{
  const available = ["The Sun", "21", "malloc(sizeof(int))", "points to a location in memory", "a bug in the actual system"];
  const questions = [
    {
      title: "What is the name of our star?",
      answer: "The Sun",
      choices: getChoices(available, "The Sun")
    },
    {
      title: "How do you allocate memory in C?",
      answer: "malloc(sizeof(int))",
      choices: getChoices(available, "malloc(sizeof(int))")
    }
  ];
  res.json(questions);
});

////// Sign up
app.get("/signup", (req, res)=>{
  res.render("authorization", {signUp: true, title: "Sign Up"});
});
app.post("/signup", (req, res)=>{
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  const { username, password, confirmation } = req.body;
  console.log(username, password, confirmation);
  if (!password)
    throw new ApplicationError("Did not provide password", 404, "/signup");
  if (password != confirmation)
    throw new ApplicationError("Confirmation does not match", 404, "/signup");
  if (!username)
    throw new ApplicationError("Username not provided", 404, "/signup");

  UserModel.addUser(username, password)
  .then((r)=>{
    console.log(r);
    req.session.user_id = r;
    res.redirect("/");
  })
  .catch((e)=>{
    throw e;
  });
});
////// Login 
app.get("/login", (req, res)=>{
  res.render("authorization", {signUp: false, title: "Log In"});
});
app.post("/login", (req, res)=>{
  const { username, password } = req.body;
  UserModel.login(username, password)
  .then((r)=>{
    req.session.user_id = r;
    res.redirect("/");
  })
  .catch((e)=>{
    throw e;
  });
});

// Error handler 
app.use((err, req, res, next)=>{
  const { message="error", status=404, before="/" } = err;
  res.render("error", {message, status});
});

app.listen(3000, ()=>{console.log("listening on port 3000")});
