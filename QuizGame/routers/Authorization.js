const express = require("express");
const session = require("express-session");
const ApplicationError = require("../ApplicationError");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());
router.use(session({secret: "secret"}));

const verifyLocation = (req, res, next)=>{
    if (req.session.userId) {
        // redirec to the home page
        res.redirect("/")
    }
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
    if (await UserModel.model.exists({username})) {
        try {
            const data = await UserModel.logIn(username, password);
            if (data) {
                req.session.userId = data.id;
                req.session.username = data.username;
                return next();
            }
            next(new ApplicationError("Failed to log you in", 404));
        } catch(e) {
            return next(e);
        }
    } else {
        return next(new ApplicationError("A user with thus username does not exist", 404)); 
    }
};
const attempSignUp = async (req, res, next)=>{
    const { username, password } = req.body;
    verifyAttempt(username, password);
    if (await UserModel.model.exists({username})) {
        return next(new ApplicationError("A user with thus username already exists", 404)); 
    } else {
        try {
            const data = await UserModel.signUp(username, password)
            if (data) {
                req.session.userId = data.id;
                req.session.username = data.username;
                return next();
            }
        } catch(e) {
            return next(e);
        }
    }
};

// Sign Up route handlers
router.get("/signup", verifyLocation, (req, res)=>{
    res.render("signup", {title: "Sign Up"});
});
router.post("/signup", attempSignUp, (req, res)=>{
    if (req.session.userId)
        res.redirect("/");
    else
        res.send("You have not been signed up");
});

// Log In route handlers
router.get("/login", verifyLocation, (req, res)=>{
    res.render("login", {title: "Log In"});
});
router.post("/login", attemptLogIn, (req, res)=>{
    if (req.session.userId)
        res.redirect("/");
    else
        res.send("you have not been loggin in");
});

// PARENT (index.js) contains the error route handler
router.use((err, req, res, next)=>{
    const { message="Error", status=404 } = err;
    res.send(err + ", " + status);
});

module.exports = router;
