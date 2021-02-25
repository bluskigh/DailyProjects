const express = require("express");
const session = require("express-session");
const userModel = require("./UserModel");
const router = express.Router();

//middleware
router.use(express.json()); // for body
router.use(session({
  // TODO: figure out how to use env variable instead.
  secret: "makebettersecret"
}));

router.get("/signup", (req, res)=>{
  res.render("signup");
});
// TODO: provide specific and correct status codes
router.post("/signup", async (req, res, next)=>{
  const {username, password, confirmation} = req.body;
  // username not provided
  if (!username)
    throw new ManagerError("Did not provide userame", 404); 
  if (!password)
    throw new ManagerError("Did not provide password", 404); 
  if (password != confirmation)
    throw new ManagerError("Password and confirmation do not match.", 404); 
  
  const id = await userModel.model.exist({username: username});
  console.log("The id of the user is: ", id);
  if (id)
  {
    return next(new ManagerError("A user with the username \"" + username + "\" already exist.", 404));
  }
  else
  {
    // log the user in now.
    req.session.user_id = id;
    // home page (logged in.... diff than home of not logged in which shows my information and about the application)
    res.redirect("/home");
  }
});

router.get("/login", (req, res)=>{
  res.render("login");
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
  const { message="Error", status=404 } = err;
  // taking to error page, show this error well. 
  res.render("error", {message, status});
});

module.exports = router;
