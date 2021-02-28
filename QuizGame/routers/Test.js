const express = require("express"); 
const ApplicationError = require("../ApplicationError");
const router = express.Router();

const verifyAction = (req, res, next)=>{
    if (req.session.userId)
        return next();
    else
        throw new ApplicationError("You're not signed in to perform this action", 404);
};

router.get("/addTest", verifyAction, (req, res)=>{
    // redirect to the test page
    res.render("/test", {title: "Creating Test", creating: true, stylesheets:["css/testEdit.css"]});
});
router.post("/test/:testId", verifyAction, (req, res)=>{
    // get testid informatin, send to the test page
    res.render("test", {title: "test_title_here", creating: false, stylesheets:["css/testView.css"]});
    // provide data
});

module.exports = router;
