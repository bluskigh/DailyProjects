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
            res.render("home", {title: "Home", username: req.session.username, stylesheets: null, tests: r});
        })
        .catch(e=>{throw e});
    }
    else
        res.redirect("/");
});

router.get("/addTest", verifyAction, (req, res)=>{
    // redirect to the test page
    res.render("test", {title: "Creating Test", creating: true, username: req.session.username, stylesheets:["css/testEdit.css"], testInfo: null, testId: null});
});
router.post("/modifyTest", (req, res)=>{
    const { add, title, desc, subject, questions, testId } = req.body;
    if (add) {
        TestModel.addTest(req.session.userId, title, desc, subject, questions)
        .then((r)=>{
            if (r)
                res.json({result: true});
        })
        .catch((e)=>{
            throw e;
        })
    } else {
        try {
            TestModel.modify(req.session.userId, testId, title, desc, subject, questions)
            .then((r)=>{
                if (r)
                    res.json({result: true});
            })
            .catch((e)=>{
                console.error(e);
                throw e;
            })
        } catch(e) {
            console.error(e);
        }
    }
});
router.post("/updateQuestion", (req, res)=>{
    const { question, answer } = req.body;
});
router.post("/test", verifyAction, (req, res)=>{
    const {testId } = req.body;
    // get testid informatin, send to the test page
    // provide the basic test information
    TestModel.getIndividualInfo(req.session.userId, testId)
    .then((r)=>{
        res.render("test", {title: "test_title_here", testId: r[0]._id, username: req.session.username, creating: false, stylesheets:["css/testView.css"], testInfo: r[0], questions: r[1]});
    })
    .catch((e)=>{
        throw e;
    });
    // provide data
});
router.get("/getTestInformation", verifyAction, (req, res)=>{
    // returns all the test correlated with the user
    TestModel.getTests(req.session.userId)
    .then((r)=>{
        res.json(r);
    })
    .catch((e)=>{
        throw e;
    })
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

router.get("/editTest", (req, res)=>{
    const { testId } = req.query;
    TestModel.getIndividualInfo(req.session.userId, testId)
    .then((r)=>{
        res.render("test", {title: "Editing the test", creating: true, username: req.session.username, stylesheets:["css/testEdit.css"], testInfo: r[0], questions: r[1], testId: r[0]._id});
    })
    .catch((e)=>{
        throw e;
    })
});

router.get("/getQuestions/:testId", (req, res)=>{
    const { testId } = req.params;
    TestModel.getQuestions(testId)
    .then((r)=>{
        res.json(r);
    })
    .catch((e)=>{
        throw e;
    })
});

router.post("/editTest", (req, res)=>{
    const { testId, testInfo, questions } = req.body; 
    res.send("still working on this functionality");
});

router.get("/isSubjectValid/:subject", (req, res)=>{
    const { subject } = req.params;
    TestModel.isSubjectValid(subject)
    .then((r)=>{
        res.json({result: r});
    })
    .catch((e)=>{
        throw e;
    })
});
module.exports = router;
