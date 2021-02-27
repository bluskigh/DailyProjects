const express = require("express");
const session = require("express-session");
const ApplicationError = require("../secondary/ApplicationError");
const UserModel = require("../models/UserModel");
const router = express.Router();

/////////// Middlewares
router.use(session({secret:"secret"})); 
router.use(express.json()); 
router.use(express.urlencoded());

const verifyBasics = (username, password)=>{
    if (!username)
        throw new ApplicationError("Username not provided", 404);
    if (!password)
        throw new ApplicationError("Password not provided", 404);
}

const verifySignUp = (req, res, next)=>{
    const { username, password, confirmation } = req.body;
    verifyBasics(username, password);
    if (password != confirmation)
        throw new ApplicationError("Confirmation does not match", 404, "/signup");
    UserModel.addUser(username, password)
    .then((r)=>{
        req.session.userId = r;
    })
    .catch((e)=>{
        next(e);
    });
    next();
};

const verifyLogIn = (req, res, next)=>{
    const { username, password } = req.body;
    verifyBasics(username, password);
    UserModel.login(username, password)
    .then((r)=>{
      req.session.userId = r;
      next();
    })
    .catch((e)=>{
        next(e);
    });
};

////// Sign up
router.get("/signup", (req, res)=>{
  res.render("authorization", {signUp: true, title: "Sign Up", stylesheets: ["authorization.css"], userId: req.session.userId});
});
router.post("/signup", verifySignUp, (req, res, next)=>{
    // passed the verifySignUp, add it to the database
    res.redirect("/");
});
////// Login 
router.get("/login", (req, res)=>{
  res.render("authorization", {signUp: false, title: "Log In", stylesheets: ["authorization.css"], userId: req.session.userId});
});
router.post("/login", verifyLogIn, (req, res)=>{
  console.log("You're now signed in");
  res.redirect("/");
});

///// signout
router.get("/signout", (req, res)=>{
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
