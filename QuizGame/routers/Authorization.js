const express = require("express");
const session = require("express-session");
const ApplicationError = require("../ApplicationError");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());
router.use(session({secret: "secret"}));

const verifyLocation = (req, res, next)=>{
    if (req.session.user_id)
        // redirec to the home page
        res.redirect("/")
    else
        next();
}

const verifyAttempt = (username, password)=>{
    // body, post returns to body
    if (!username)
        throw new ApplicationError("Username not provided", 406);
    if (!password)
        throw new ApplicationError("Password not provided", 406);
    // why? just to make sure.... we are returning in case more code is added to this section.
};

const attemptLogIn = async (req, res, next)=>{
    const { username, password } = req.body;
    verifyAttempt(username, password);
    try {
        const id = await UserModel.logIn(username, password);
        if (id)
            return next();
        next(new ApplicationError("Failed to log you in", 404));
    } catch(e) {
        next(e);
    }
};

// Sign Up route handlers
router.get("/signup", verifyLocation, (req, res)=>{
    res.render("signup", {title: "Sign Up"});
});
router.post("/signup", (req, res)=>{
});

// Log In route handlers
router.get("/login", verifyLocation, (req, res)=>{
    res.render("login", {title: "Log In"});
});
router.post("/login", attemptLogIn, (req, res)=>{
    res.send("You have been \"logged\" in");
});

// PARENT (index.js) contains the error route handler

module.exports = router;
