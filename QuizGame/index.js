const express = require("express");
const ApplicationError = require("./ApplicationError");
const AuthorizationRouter = require("./routers/Authorization");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

///// Middleware
app.use(AuthorizationRouter);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res)=>{
    if (req.session.userId)
        res.render("home", {title: "Home", username: req.session.username, stylesheets:null});
    else
        res.render("index", {title: "Home", username: null, stylesheets:null});
});

app.get("/signout", (req, res)=>{
    if (req.session.userId) 
        req.session.destroy();
    res.redirect("/");
});

// Error route handler
app.use((err, req, res, next)=>{
    const { message="Error", status=404, where="/" } = err;
    res.render("error", {message, status, where});
});

app.listen(3000, ()=>{console.log("Listening on port 3000")});
