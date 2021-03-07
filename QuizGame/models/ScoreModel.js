const mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost:27017/quizGame");

const ScoreSchema = new mongoose.Schema({
    title: String,
    desc: String,
    subject: Object, 
    score: Number,
    questions: [Object],
    testId: String,
    userId: String,
    created: {
        type: Date,
        default: Date.now
    }
});
const ScoreModel = new mongoose.model("Score", ScoreSchema);

module.exports.addScore = (testInfo, questions, score, userId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const temp = new ScoreModel({title: testInfo.title, desc: testInfo.desc, subject: testInfo.subject, 
                score, questions: questions, testId: testInfo._id, userId, testId: testInfo._id}); 
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
module.exports.getScoreInfo = (scoreId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            let result = await ScoreModel.findOne({_id: scoreId});
            if (!result)
                resolve(false);

            resolve(result);

        } catch(e) {
            reject(e);
        }
    });
};
module.exports.getRecent = (userId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await ScoreModel.find({userId});
            resolve(result.splice(result.length - 4));
        } catch(e) {
            reject(e);
        }
    });
};
