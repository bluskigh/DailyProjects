const mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost:27017/quizGame");

const ScoreSchema = new mongoose.Schema({
    title: String,
    desc: String,
    subject: Object, 
    score: Number,
    questions: [Object],
    testId: String,
    userId: String
});
const ScoreModel = new mongoose.model("Score", ScoreSchema);

module.exports.addScore = (testInfo, questions, score, userId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const temp = new ScoreModel({title: testInfo.title, desc: testInfo.desc, subject: testInfo.subject, 
                score, questions: questions, testId: testInfo._id, userId}); 
            await temp.save();
            resolve(temp._id);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.removeScore = (scoreId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await ScoreModel.deleteOne({_id: scoreId, userId});
            console.log("the result of deleting: ", result);
            if (result)
                resolve(true);
            else
                reject(false);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.getAllScores = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await ScoreModel.find({userId})); 
        } catch(e) {
            reject(e);
        }
    });
};
