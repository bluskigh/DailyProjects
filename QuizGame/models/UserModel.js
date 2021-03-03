/*
 * This file contains anything related to the user.
 * That includes: auth/authorization, and preferences.
 * Preferences, when user visits options, models such as Subject will be
 * stored here.
 */
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/quizGame")
    .then(r=>{console.log("Connected to database")})
    .catch(e=>{console.error(e)})

const SubjectSchema = new mongoose.Schema({
    userId: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});
const SubjectModel = new mongoose.model("Subject", SubjectSchema);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 25,
        lower: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 1,
        lower: true,
        required: true
    }
});
const UserModel = new mongoose.model("User", UserSchema);

function encrypt(password) {
    return new Promise(async (resolve, reject)=>{
        try {
            // extra protection
            const salt = await bcrypt.genSalt(10); 
            const hash = await bcrypt.hash(password, salt);
            resolve(hash);
        } catch(e) {
            reject(e);
        }
    });
}
    
// Custom actions
/*
 * Before running, make sure to run model.exists()!
 */
module.exports.signUp = (username, password)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            password = await encrypt(password);
            const temp = new UserModel({username, password});
            await temp.save();
            // add default subjects
            await SubjectModel.insertMany([{userId: temp._id, title: "Math", color: "#cc66ff"}, {userId: temp._id, title: "English", color: "#00ffcc"}, {userId: temp._id, title: "Computer", color: "#3333ff"}]);
            resolve({username, id: temp._id});
        } catch(e) {
            reject(e);
        }
    });
};
/*
 * Before running this method, make sure to run model.exists()!
 * This method will not check if the username exists, as it is assumed that it does exists. 
 */
module.exports.logIn = (username, password)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const tempModel = await UserModel.findOne({username})
            if (tempModel) {
                const successful = await bcrypt.compare(password, tempModel.password);
                if (successful)
                    resolve({username, id: tempModel._id});
                else
                    // TODO: check if you can replace with reject(false)
                    resolve(false);
            } else {
                resolve(false);
            }

        } catch(e) {
            reject(e);
        }
    });
};
module.exports.addSubject = (info)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const temp = new SubjectModel(info);
            await temp.save();
            console.log("The result of addSubject: ", temp);
            resolve(temp._id);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.getSubjects = (userId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await SubjectModel.find({userId});
            resolve(result);
        } catch(e) {
            reject(e);
        }
    });
};
module.exports.deleteSubject = (subjectId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await SubjectModel.deleteOne({_id: subjectId});
            if (result)
                resolve(true);
            resolve(false);
        } catch(e) {
            reject(e);
        }
    });
};
// For general actions on the model, such as find({}), exists({})
module.exports.model = UserModel;
