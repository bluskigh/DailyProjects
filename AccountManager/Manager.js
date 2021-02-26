const express = require("express");
const session = require("express-session");
const userModel = require("./UserModel");
const path = require("path");
const router = express.Router();

router.use(express.static(path.join(__dirname, "public")));

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
    where: "/signout",
    title: "Sign Out"
  }
];

router.get("/home", verifyAction, (req, res)=>{
  userModel.model.findOne({_id: req.session.user_id})
  .then((r)=>{
    res.render("home", {styleLocation: "css/home.css", title: "Home", links: links, username: r.username});
  })
  .catch((e)=>{
    throw new e;
  })
});

module.exports = router;
