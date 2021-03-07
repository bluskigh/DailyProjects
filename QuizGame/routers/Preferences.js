const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();

const verifyAttempt = (req, res, next)=>{
    if (req.session.userId)
        return next()
    res.redirect("/");
};

router.use(express.urlencoded());
router.use(express.json());

router.get("/options", verifyAttempt, (req, res)=>{
    res.render("options", {title: "Options", username: req.session.username, stylesheets:["css/options.css"]});
});
router.post("/addSubject", verifyAttempt, (req, res)=>{
    const { title, color } = req.body;
    console.log("Subject title: ", title, "\nSubject color: ", color);
    UserModel.addSubject({userId: req.session.userId, title, color})
    .then((r)=>{
        res.json({result: r});
    })
    .catch((e)=>{
        throw e;
    })
});

router.get("/getSubjects", (req, res)=>{
    UserModel.getSubjects(req.session.userId)
    .then((r)=>{
        if (r.length == 0)
            res.json(null)
        else
            res.json(r);
    })
    .catch((e)=>{
        throw e;
    })
});

router.post("/deleteSubject", (req, res)=>{
    const { subjectId } = req.body;
    console.log(subjectId);
    if (subjectId) {
        UserModel.deleteSubject(subjectId)
        .then((r)=>{
            // sending back status: true = worked, false = did not work
            res.json({result: r});
        })
        .catch((e)=>{
            throw e;
        })
    } else {
        res.json(false);
    }
});

module.exports = router;
