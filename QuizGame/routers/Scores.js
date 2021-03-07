const ScoreModel = require("../models/ScoreModel");
const express = require("express");
const ApplicationError = require("../ApplicationError");
const router = express.Router();

const verifyAction = (req, res, next) => {
    if (req.session.userId)
        return next()
    else
        throw new ApplicationError("You're not signed in to perform this action", 404);
};

router.get("/scores", verifyAction, (req, res)=>{
    // get all the scores
    ScoreModel.getAllScores(req.session.userId)
    .then((r)=>{
        res.render("scores", {title: "Scores", username: req.session.username, stylesheets: ["css/scores.css"], scores: r});
    })
    .catch((e)=>{
    })
});

module.exports = router;
