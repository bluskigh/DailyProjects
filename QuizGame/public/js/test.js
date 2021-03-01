const testId = document.querySelector("#testContainer").getAttribute("name");

let questions = [];

const getQuestions = ()=>{
    console.log(testId);
    if (testId != null)
    {
        fetch("/getQuestions/" + testId)
        .then(async (r)=>await r.json())
        .then((r)=>{
            console.log(typeof(r));
            console.log(r);
            // make questions equal to the r array
            questions = r;
        })
        .catch((e)=>{
            console.log("There seems to be an error", e);
        })
    }
};

const questionsContainer = document.querySelector("#questions");
function createInput(name) {
    const temp = document.createElement("input");
    temp.type="text";
    temp.setAttribute("name", name);
    temp.setAttribute("placeholder", name + " here");
    return temp;
}

function createButton(name, symbol) {
    const temp = document.createElement("a");
    temp.innerText = symbol;
    temp.classList.add(name);
    return temp;
} 

// Adds question to the questionsContainer 
function generateQuestion() {
    const form = document.createElement("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();
        console.log("this is running");
    });
    form.classList.add("question");
    const questionInput = createInput("question");
    const answerInput = createInput("answer");
    form.appendChild(questionInput);
    form.appendChild(answerInput);
    const options = document.createElement("div");
    options.classList.add("questionOptions");
    const deleteButton = createButton("delete", "X");
    deleteButton.addEventListener("click", function(){
        const parentForm = this.parentElement.parentElement; 
        questionsContainer.removeChild(parentForm);
        questions.splice(questions.indexOf(parentForm), 1);
    });
    // const moveButton = createButton("move", "|");
    options.appendChild(deleteButton);
    // options.appendChild(moveButton);
    form.appendChild(options);
    questionsContainer.appendChild(form);
    questions.push(form);
}
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
doneButton.addEventListener("click", function(){
    if (questions.length >= 1) { 
        const testTitle = document.querySelector("[name=title]").value; 
        const testDesc = document.querySelector("[name=desc]").value; 
        const testSubject = document.querySelector("[name=subject]").value; 

        let result = [];
        for (const question in questions) {
            const current = questions[question];
            const questionValue = current.querySelector("[name=question]").value;
            const answerValue = current.querySelector("[name=answer]").value;

            if (questionValue.length >= 1 && answerValue.length >= 1)
            {
                result.push({
                    question: questionValue,
                    answer: answerValue,
                    index: question
                });
            }
        }

        // went throw and did not include the one that weren't filled in.
        if (result.length >= 1)
        {
            fetch("/addTest", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json"
                }),
                body: JSON.stringify({
                    title: testTitle,
                    desc: testDesc,
                    subject: testSubject,
                    questions: result 
                })
            })
            .then(async (r)=>await r.json())
            .then((r)=>{
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
});

// On load of the page, we want to place a question for the user already there
generateQuestion();
