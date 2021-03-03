const subjectSelector = document.querySelector("#subjectContainer");
function tempOption(value) {
    const temp = document.createElement("option");
    temp.setAttribute("value", value);
    temp.innerText = value;
    subjectSelector.appendChild(temp);
}
fetch("/getSubjects")
.then(async (r) => await r.json())
.then((r)=>{
    if (r) {
        for (const subject of r) {
            tempOption(subject.title);
        }
    } else {
        // set defaults
        tempOption("Math");
        tempOption("Reading");
        tempOption("Algebra");
        tempOption("English");
        // this may not be a good idea... will come back to it later.
    }   
})
.catch((e)=>{
    console.error(e);
})

const testId = document.querySelector("#testContainer").getAttribute("name");

const questionsContainer = document.querySelector("#questions");
function createInput(name, inputValue=null) {
    const container = document.createElement("div");
    container.classList.add("columnFlex");
    const label = document.createElement("label");
    label.innerText = name;
    container.appendChild(label);
    const temp = document.createElement("input");
    if (inputValue) 
        temp.value = inputValue;
    temp.type="text";
    temp.setAttribute("name", name);
    temp.setAttribute("placeholder", name + " here");
    container.appendChild(temp);
    return container;
}

function createButton(name, symbol) {
    const temp = document.createElement("a");
    temp.innerText = symbol;
    temp.classList.add(name);
    return temp;
} 

function deleteClicked(obj) {
    console.log("delete clicked");
    const parentForm = obj.parentElement.parentElement; 
    questionsContainer.removeChild(parentForm);
    try {
        questions.splice(questions.indexOf(parentForm), 1);
    } catch(e) {
        console.error(e);
    }
}

let questions = [];

// Adds question to the questionsContainer 
function generateQuestion(questionId=null, questionValue=null, answerValue=null) {
    const form = document.createElement("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();
        console.log("this is running");
    });
    if (questionId)
        form.setAttribute("name", questionId);
    form.classList.add("question");
    const questionInput = createInput("question", questionValue);
    const answerInput = createInput("answer", answerValue);
    form.appendChild(questionInput);
    form.appendChild(answerInput);
    const options = document.createElement("div");
    options.classList.add("questionOptions");
    const deleteButton = createButton("delete", "X");
    deleteButton.addEventListener("click", function(){
        deleteClicked(this);
    });
    // const moveButton = createButton("move", "|");
    options.appendChild(deleteButton);
    // options.appendChild(moveButton);
    form.appendChild(options);
    questionsContainer.appendChild(form);
    const hr = document.createElement("hr"); 
    questionsContainer.appendChild(hr);
    questions.push(form);
}


const getQuestions = ()=>{
    if (testId != "")
    {
        fetch("/getQuestions/" + testId)
        .then(async (r)=>await r.json())
        .then((r)=>{
            // make questions equal to the r array
            // well go to the server, get a list of questions that are related to the currente test the user is in right now 
            for (const question of r) {
                generateQuestion(question._id, question.question, question.answer);
            }

            // On load of the page, we want to place a question for the user already there
            generateQuestion();
        })
        .catch((e)=>{
            console.log("There seems to be an error", e);
        })
    }
};
getQuestions();

// Add a question
const addQuestion = document.querySelector("#addQuestion");
addQuestion.addEventListener("click", function(){
    // add a question to let the user use
    generateQuestion();
});

let forms = document.querySelectorAll(".question");
for (const form of forms) {
    form.addEventListener("submit", function(e){
        e.preventDefault();
        // TODO: do not allow the user to continue submitting 
        // if nothing has been updated
        const children = this.children;
        const question = children[0];
        const answer = children[1];
        fetch("/updateQuestion", {
            method: POST,
            headers: new Headers({
                "content-type": "application/json"
            }),
            boyd: JSON.stringify({
                question,
                answer
            })
        })
        .then(async (r)=>await r.json())
        .then((r)=>{
            console.log("The response from the request: ", r)
            if (r)
                alert("You question was updated successfuly")
            else
                alert("Did not update your question.")
        })
        .catch(e=>{console.error(e)})
    });
}

const doneButton = document.querySelector("#done");
function doneOreditClicked(obj, isDone) { 
    if (questions.length >= 1) { 
        const testTitle = document.querySelector("[name=title]").value; 
        const testDesc = document.querySelector("[name=desc]").value; 
        const testSubject = document.querySelector("[name=subject]").value; 

        let result = [];
        for (const question in questions) {
            const current = questions[question];
            const questionValue = current.querySelector("[name=question]").value;
            const answerValue = current.querySelector("[name=answer]").value;
            let id = null;
            if (current.getAttribute("name"))
                id = current.getAttribute("name")

            if (questionValue.length >= 1 && answerValue.length >= 1)
            {
                result.push({
                    questionId: id,
                    question: questionValue,
                    answer: answerValue,
                    index: question
                });
            }
        }

        // went throw and did not include the one that weren't filled in.
        if (result.length >= 1)
        {
            fetch("/modifyTest", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json"
                }),
                body: JSON.stringify({
                    testId: isDone ? null : testId,
                    add: isDone,
                    title: testTitle,
                    desc: testDesc,
                    subject: testSubject,
                    questions: result 
                })
            })
            .then(async (r)=>await r.json())
            .then((result)=>{
                if (result)
                    document.location.href = "/home";
                else
                    alert("Something went wrong... Could not add your new test to the database.");
            })
            .catch((e)=>{
                console.error(e);

            })
        }
        else
        {
            console.log("There is nothing to add with. Tell the user to add some questions to this test.");
        }
    }
}
if (doneButton) {
    doneButton.addEventListener("click", function(){
        doneOreditClicked(this, true);
    });
}


const editButton = document.querySelector("#edit"); 
if (editButton) {
    editButton.addEventListener("click", function(){
        // false, becuase we are not adding, but modifying this.
        doneOreditClicked(this, false);
    });
}
