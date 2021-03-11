const express = require("express");
<<<<<<< HEAD
=======
const ApplicationError = require("./ApplicationError");
const TestRouter = require("./routers/Test");
const AuthorizationRouter = require("./routers/Authorization");
const ScoreRouter = require("./routers/Scores");
const PreferencesRouter = require("./routers/Preferences");
>>>>>>> 9e2c8126be29cf45c6b48db23e5726a78bbf4047
const path = require("path");
const app = express();

app.set("view engine", "ejs");
<<<<<<< HEAD
app.set("views", path.join(__dirname, "views"));
// app.use(helmet({contentSecurityPolicy: false}));

app.get("/", (req, res)=>{
  res.render("index");
});
=======
app.set("views", path.join(__dirname, "/views"));

///// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(AuthorizationRouter);
app.use(TestRouter);
app.use(PreferencesRouter);
app.use(ScoreRouter);

app.get("/", (req, res)=>{
    console.log(req.session.userId);
    if (req.session.userId)
        res.redirect("/home");
    else
        res.render("index", {title: "Home", username: null, stylesheets:["css/index.css"]});
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

>>>>>>> 9e2c8126be29cf45c6b48db23e5726a78bbf4047
app.listen(3000, ()=>{console.log("Listening on port 3000")});
