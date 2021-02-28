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
	res.render("index", {title: "Home"});
});

// Error route handler
app.use((err, req, res, next)=>{
    const { message="Error", status=404 } = err;
    res.send(err + status);
});

app.listen(3000, ()=>{console.log("Listening on port 3000")});
