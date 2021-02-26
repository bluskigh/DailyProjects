const express = require("express");
const session = require("express-session");
const userModel = require("./UserModel");
const router = express.Router();

router.use(session({
  // TODO: figure out how to use env variable instead.
  secret: "makebettersecret"
}));

const verifyAction = (req, res, next)=>{
  if (req.session.user_id)
  {
    return next();
  }
  else
  {
    res.redirect("/");
  }
};

const links = [
  {
    where: "/create",
    title: "Create Employee"
  },
  {
    where: "/accounts",
    title: "Show Accounts"
  },
  {
    where: "/signout",
    title: "Sign Out"
  }
];

router.get("/home", verifyAction, (req, res)=>{
  if (req.session.user_id)
  {
    res.render("home", {styleLocation: "css/home.css", title: "Home", links: links});
  }
  else
  {
    res.redirect("/");
  }
});

router.get("/create", (req, res)=>{
  const { username, password } = req.body;


  userModel.createUser(username, password, req.session.user_id)
  .then((r)=>{

  })
  .catch((e)=>{
    throw new e;
  })

});

router.get("/accounts", verifyAction, (req, res)=>{
  res.send("Have not implemented this function yet");
});

module.exports = router;
