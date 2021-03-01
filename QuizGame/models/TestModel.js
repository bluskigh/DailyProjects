const UserModel = require("./UserModel")
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/quizGame")
.then((r)=>{console.log("connected to the database")})
.catch(e=>{console.error("laksjdf")})

const TestSchema = new mongoose.Schema({
    userId: Object,
    title: String,
    desc: String,
    subject: String
});
const TestModel = new mongoose.model("Test", TestSchema);

const QuestionSchema = new mongoose.Schema({
    testId: Object,
    question: String,
    answer: String,
    index: {
        type: Number,
        min: 0
    }
});
const QuestionModel = new mongoose.model("Question", QuestionSchema); 

module.exports.getTests = (userId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await TestModel.find({userId});
            if (result.length >= 1)
                resolve(result);
            resolve(false);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.getIndividualInfo = (userId, testId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await TestModel.find({_id: testId, userId});
            console.log(result);
            resolve(result);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.addTest = (userId, title, desc, subject, questions)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            // add the test
            const temp = new TestModel({userId, title, desc, subject});
            await temp.save();
            // now add the questions correlated to the test
            for (const index in questions) {
                questions[index].testId = temp._id;
            }
            const result = await QuestionModel.insertMany(questions);
            console.log(result);
            if (result)
                resolve(true);
        } catch(e) {
            reject(e);
        }
    });
};
