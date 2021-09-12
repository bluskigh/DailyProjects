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

const verifyLogIn = (req, res, next)=>{
  const { username, password } = req.body;
  if (!username)
    next(new ManagerError("You did not provide a username", 404, "/login")); 
  if (!password)
    next(new ManagerError("You did not provide a password", 404, "/login")); 

  console.log(password)
  userModel.login(username, password)
  .then((r)=>{
    // everything went well, log the user in
    req.session.user_id = r;
    next();
  })
  .catch((e)=>{
    // if anything went wrong with login method from the userModel, show in the error handler
    const { message="Could not log you in", status=404 } = e;
    return next(new ManagerError(message, status, "/login"));
k  });
  // check if username even exists 
  // if not, throw an error saying that username is not in our database
  // if it does, then attempt sign in.
};


router.get("/signup", (req, res)=>{
  if (req.session.user_id)
  {
    res.redirect("/");
  }
  else
  {
    res.render("signupORlogin", {styleLocation: "css/signup.css", title: "Sign Up", signUp: true, logIn: false, home: false});
  }
});
// TODO: provide specific and correct status codes
router.post("/signup", verifySignUp, (req, res)=>{
  // home page diff from /
  res.redirect("/home");
});

router.get("/login", (req, res)=>{
  if (req.session.user_id)
  {
    res.redirect("/");
  }
  else
  {
    res.render("signupORlogin", {styleLocation: "css/signup.css", title: "Log In", signUp: false, logIn: true, home: false});
  }
});

router.post("/login", verifyLogIn, (req, res)=>{
  res.redirect("/home");
});

router.get("/signout", (req, res)=>{
  if (req.session.user_id)
  {
    // clearing the session (id);
    req.session.destroy();
    // redirect to the home page, given options to sign up or log in
  }
  res.redirect("/");
});


////// Error handler
router.use((err, req, res, next)=>{
  console.error(err);
  const { message="Error", status=404, leftOff="/" } = err;
  // taking to error page, show this error well. 
  res.render("error", {message, status, leftOff});
});

module.exports = router;
