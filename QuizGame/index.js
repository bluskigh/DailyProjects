const express = require("express");
const ApplicationError = require("./ApplicationError");
const TestRouter = require("./routers/Test");
const AuthorizationRouter = require("./routers/Authorization");
const PreferencesRouter = require("./routers/Preferences");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

///// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(AuthorizationRouter);
app.use(TestRouter);
app.use(PreferencesRouter);

app.get("/", (req, res)=>{
    console.log(req.session.userId);
    if (req.session.userId)
        res.redirect("/home");
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
