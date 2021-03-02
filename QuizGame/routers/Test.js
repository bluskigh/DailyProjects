const express = require("express"); 
const TestModel = require("../models/TestModel");
const ApplicationError = require("../ApplicationError");
const path = require("path");
const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router.use(express.static(path.join(__dirname, "/public")));

const verifyAction = (req, res, next)=>{
    if (req.session.userId)
        return next();
    else
        throw new ApplicationError("You're not signed in to perform this action", 404);
};
router.get("/home", (req, res)=>{
    if(req.session.userId) {
        TestModel.getTests(req.session.userId)
        .then((r)=>{
            console.log(r);
            res.render("home", {title: "Home", username: req.session.username, stylesheets: null, tests: r});
        })
        .catch(e=>{throw e});
    }
    else
        res.redirect("/");
});

router.get("/addTest", verifyAction, (req, res)=>{
    // redirect to the test page
    res.render("test", {title: "Creating Test", creating: true, username: req.session.username, stylesheets:["css/testEdit.css"], testId: null});
});
router.post("/addTest", (req, res)=>{
    const { title, desc, subject, questions } = req.body;
    TestModel.addTest(req.session.userId, title, desc, subject, questions)
    .then((r)=>{
        if (r)
            res.json({result: true});
    })
    .catch((e)=>{
        throw e;
    })
});
router.post("/updateQuestion", (req, res)=>{
    const { question, answer } = req.body;
});
router.post("/test", verifyAction, (req, res)=>{
    let {testId} = req.body;
    // get testid informatin, send to the test page
    // provide the basic test information
    TestModel.getIndividualInfo(req.session.userId, testId)
    .then((r)=>{
        console.log("0-------", r[0], r[0].title);
        res.render("test", {title: "test_title_here", testId: r[0]._id, username: req.session.username, creating: false, stylesheets:["css/testView.css"], testInfo: r[0], questions: r[1]});
    })
    .catch((e)=>{
        throw e;
    });
    // provide data
});
router.get("/getTest", verifyAction, (req, res)=>{
});
router.post("/deleteTest", verifyAction, (req, res)=>{
    const { testId } = req.body;
    if (testId) {
        TestModel.removeTest(testId)
        .then((r)=>{
            res.json(r);
        })
        .catch((e)=>{
            throw e;
        })
    } else {
        res.json({result: false});
    }
});


module.exports = router;
