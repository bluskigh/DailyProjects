const UserModel = require("./UserModel");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/quizGame")
.then((r)=>{console.log("connected to the database")})
.catch(e=>{console.error("laksjdf")})

const TestSchema = new mongoose.Schema({
    userId: Object,
    title: String,
    desc: String,
    subject: String,
    // created does not have to be required, as it will be given a default value of when it was created.
    created: {
        type: Date,
        default: Date.now
    }
});
const TestModel = new mongoose.model("Test", TestSchema);

const QuestionSchema = new mongoose.Schema({
    testId: String,
    underSubject: String,
    question: String,
    answer: String,
    index: {
        type: Number,
        min: 0
    }
});
const QuestionModel = new mongoose.model("Question", QuestionSchema); 

const getTests = (userId)=>{
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
}
/////////////////// End of schemas and models

////// Start of modules.exports && methods
module.exports.getTests = getTests;

let allQuestions = null;
QuestionModel.find({})
.then((r)=>{
    allQuestions=r;
})
.catch((e)=>{console.log("Something went wrong getting all the queastions")});

// returns back a random number floored, based on the area given
function genRandom(area) {
    return Math.floor(Math.random()*area);
}

// iterates over the array given, if target is encountered, then returns true
function isIn(array, target){
    for (const item of array) {
        if (item == target)
            return true;
    }
    return false;
}

/*
 * Answer = target
 * Subject = target's subject
 * Main iteration is 3, randomly get 3 possible answers, but leave space for the actual answer. 
 * Second iteration.... while(temp.length < 4)
 * - As long as the temp array only contain less than 3 possible answers... run the code
 * - Randomly get a number for the index (randIndex)
 * - Use the random number to get a random question (question contains the answer)
 * - If statement: 
 *   ----- if true 
 *   - check if the random picked question answer not already in the possible answers array
 *   - make sure the picked answer is not the same as the given answer (parameter)
 *   ----- And if this is true
 *   - also make sure that the picked answer, is under the same subject as the given subject (parameter)
 *   ---- then skip... find another answer
 * Finally, insert the actual answer in the possibleAnswers array.
 */
function getPossibleAnswers (answer, subject) {
    const length = allQuestions.length;

    let possibleAnswers = [];
    let randIndex = null;
    for (let i = 0; i < 3; i++)
    {
        while (possibleAnswers.length < 4) {
            randIndex = genRandom(length);
            const picked = allQuestions[randIndex];
            if (picked.underSubject == subject) {
                if ((isIn(possibleAnswers, picked.answer) || picked.answer === answer)) {
                    continue;
                }
                else {
                    // some questions are weird and contain only answers.
                    if (picked.answer)
                        possibleAnswers.push(picked.answer);
                    else 
                        possibleAnswers.push(picked)
                    // breaking because we found our answer
                    break;
                }
            }
        }
    }
    // why 4? the array is always going to be a length of 4(3 randomly picked question, and the with the inserted asnwer) 
    random = genRandom(4);
    possibleAnswers.splice(random, 0, answer);
    return possibleAnswers;
} 

/*
 * Locates the Test which contains the given testId, and userId
 * Returns back an object of the query.
 * Possible outcomes: Object{information}, null
 */
function getTestInfo(testId, userId) {
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await TestModel.findOne({_id: testId, userId: userId});
            resolve(result);
        } catch(e) {
            reject(e);
        }
    });
}
/*
 * Given a testId, each question will contain a variable which references to the test that it is under.
 * What this method does is, iterate through all the questions which are under the given test.
 * While also, generating possible answers (A, B, C, D) for the current question.
 *
 * testId = _id of the test
 * subject = subject the test is under (math, science, reading, etc)
 * 1) get all the questions correlated with the given testId
 * 2) iterate through each question correlated with the current testId 
 * - get the array of possible answer choices (which also includes the answer itself)
 * - set the question.possible (an array that stores(A, B, C, D) possible answers
 * - push the question to the result array that is going to be used in production
 *  Resolve with the result
 */
function getTestQuestions(testId, subject) {
    return new Promise(async (resolve, reject)=>{
        try {
            let questions = await QuestionModel.find({testId}); 
            let result = [];
            for (let question of questions)
            {
                const possible = getPossibleAnswers(question.answer, subject);
                question.possible = possible;
                result.push(question);
            }
            resolve(result);
        } catch(e) {
            reject(e);
        }
    });
}

/*
 * Given a testId, will return all the questions that have 
 * the given testId.
 */
module.exports.getQuestions = (testId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await QuestionModel.find({testId: testId});
            resolve(result);
        } catch(e) {
            reject(e);
        }
    });
};

/*
 * Gets all the test questions that are correlated with the testId.
 * Gets the test information (test title, test subject, test description) that is under the testId and userId given.
 * Resolve with an array of the information.
 */
module.exports.getIndividualInfo = (userId, testId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            // const testInfo = await TestModel.findOne({_id: testId, userId: userId});
            const testInfo = await getTestInfo(testId, userId);
            const result = await getTestQuestions(testId, testInfo.subject);
            resolve([testInfo, result]);
        } catch(e) {
            reject(e);
        }
    });
};

/*
 * Given userId, title, desc, subject, questions.
 * Creates a temporary object, which stores all the given information.
 * Then saves the object to the database.
 * Then adds all the questions given to the question collection in the database.
 * - By iterating over each of them, and assigning them the testId of the newly created
 *   test object.
 * After all the questions are assigned the testId of the newly created object, they are then
 * inserted into the questions database.
 * If successfull, we return true.
 */
module.exports.addTest = (userId, title, desc, subject, questions)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            // store information in object
            const temp = new TestModel({userId, title, desc, subject});
            // save the object to the Test collection.
            await temp.save();
            // iterate through each question, assigning the _id of the newly created object created above.
            for (const index in questions) {
                questions[index].testId = temp._id;
            }
            // insert all the questions in the Questions collection in the database
            const result = await QuestionModel.insertMany(questions);
            for (const question of questions) {
                allQuestions.push(question);
            }
            // if successfull, then resolve with true
            if (result)
                resolve(true);
            else
                resolve(false);
        } catch(e) {
            reject(e);
        }
    });
};

/*
 * Simply removes a test based on the testId
 */
module.exports.removeTest = (testId)=>{
    return new Promise(async (resolve, reject)=>{
        try { 
            const result = await TestModel.deleteOne({_id: testId});
            if (result) {
                /*
                 * Uncomment to delete all the questions correlated with the test.
                 * For now keeping them, so I can have random questions possibilties to pick from
                 * when generating test.
                 */
                //QuestionModel.deleteMany({testId})
                //.then((r)=>{
                    // move resolve() here if using deleteMany
                //})
                resolve({result: true});
            }
            else {
                resolve({result: false})
            }
        } catch(e) {
            reject(e);
        }
    });
};

/*
 * Contains a variety of parameters.... 
 * ---- For test information
 *  - title, desc, subject
 *  if title is empty, then the user does not want to modify the title
 *  if the desc is empty the user does not want to modify the description
 *  if subject is empty the user does not want to modify the subject.
 * ---- For question modification
 *  By iterating over each question in the question array, if the parameters if the question does not equal
 *  the parameters of the question in the database, then update the given parameter.
 *  Ex: A question in the array, its title does not equal the title if the exact same question in the database, then
 *  update the title in the database to the question in the array's title. 
 *  ALSO the above statement only runs if a questionId is available from the question that indicates, that its an existing question, 
 *  otherwise, if its null, then its a question the user decided to add to their test.
 *  ---- If adding question
 *  just follow regular procedure, create a temporary object that stores the questions information, then save to the database.
 */
module.exports.modify = (userId, testId, title, desc, subject, questions)=>{
    console.log("this was called atleast");
    return new Promise(async (resolve, reject)=>{
        try {
            // first get information regarding the test selected
            const result = await getTestInfo(testId, userId);
            // compare given title with the given desc
            if (result.title != title)
                await TestModel.updateOne({_id: testId}, {title: title}); 
            if (result.desc != desc)
                await TestModel.updateOne({_id: testId}, {desc: desc});
            if (result.subject != subject)
                await TestModel.updateOne({_id: testId}, {subject: subject});
            // now update the questions
            for (const question of questions) {
                if (question.questionId) { 
                    // modify the question
                    const inDatabase = await QuestionModel.findOne({_id: question.questionId}); 
                    if (question.title != inDatabase.title)
                        await QuestionModel.updateOne({_id: questionId}, {title: question.title});
                    if (question.desc != inDatabase.desc)
                        await QuestionModel.updateOne({_id: questionId}, {desc: question.desc});
                    if (question.underSubject != inDatabase.underSubject)
                        await QuestionModel.updateOne({_id: questionId}, {underSubject: question.underSubject});

                    // const success = await QuestionModel.updateOne({_id: question.questionId}, {title: question.title, desc: question.desc, underSubject: subject});
                } else {
                    // add the question 
                    const temp = new QuestionModel({testId: testId, question: question.question, answer: question.answer, index: question.index});
                    await temp.save();
                    // add the question to allQuestions
                    allQuestions.push(temp);
                }
            }
            resolve(true);
        } catch(e) {
            reject(e);
        }
    });
};

// for general operations such as: find(), exists()
module.exports.model = TestModel;
