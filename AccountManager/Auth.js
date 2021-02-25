const express = require("express");
const session = require("express-session");
const ManagerError = require("./ManagerError");
const userModel = require("./UserModel");
const router = express.Router();

//middleware
router.use(express.urlencoded());
router.use(express.json()); // for body
router.use(session({
  // TODO: figure out how to use env variable instead.
  secret: "makebettersecret"
}));

const verifySignUp = async (req, res, next)=>{
  const {username, password, confirmation} = req.body;
  // username not provided
  if (!username)
  {
    console.error("The username was not given");
    next(new ManagerError("Did not provide userame", 404, "/signUp"));
  }
  if (!password)
    next(new ManagerError("Did not provide password", 404, "/signUp")); 
  if (password != confirmation)
    next(new ManagerError("Password and confirmation do not match.", 404, "/signUp")); 
  
  const id = await userModel.model.exists({username: username});
  console.log("The id of the user is: ", id);
  if (id)
  {
    return next(new ManagerError("A user with the username \"" + username + "\" already exist.", 404));
  }
  else
  {
    try{
      const id = await userModel.createUser(username, password);
      // log the user in now.
      req.session.user_id = id;
      return next();
    }catch(e){
      // throw the error to the error route handler
      return next(e);
    }
  }
};

router.get("/signup", (req, res)=>{
  res.render("signup", {styleLocation: "css/signup.css", title: "Sign Up", signUp: true, logIn: false, home: false});
});
// TODO: provide specific and correct status codes
router.post("/signup", verifySignUp, (req, res)=>{
  // home page diff from /
  res.redirect("/home");
});

router.get("/login", (req, res)=>{
  res.render("login", {styleLocation: "css/login.css", title: "Log In", signUp: false, logIn: true, home: false});
});
router.post("/login", (req, res)=>{
  res.send("Have nto implemented this yet");
});

router.get("/signout", (req, res)=>{
  // clearing the session (id);
  req.session.destroy();
  // redirect to the home page, given options to sign up or log in
  res.redirect("/");
});


////// Error handler
router.use((err, req, res, next)=>{
  const { message="Error", status=404, leftOff="/" } = err;
  // taking to error page, show this error well. 
  res.render("error", {message, status, leftOff});
});

module.exports = router;
