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
