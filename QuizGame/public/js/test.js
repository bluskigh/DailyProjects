const questionsContainer = document.querySelector("#questions");
function createInput(name) {
    const temp = document.createElement("input");
    temp.type="text";
    temp.setAttribute("name", name);
    temp.setAttribute("placeholder", name + " here");
    return temp;
}
function createButton(name, symbol) {
    const temp = document.createElement("button");
    temp.innerText = symbol;
    temp.classList.add(name);
    return temp;
} 
// Adds question to the questionsContainer 
function generateQuestion() {
    const form = document.createElement("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();
    });
    form.classList.add("question");
    const questionInput = createInput("question");
    const answerInput = createInput("answer");
    const options = document.createElement("div");
    form.appendChild(questionInput);
    form.appendChild(answerInput);
    options.classList.add("questionOptions");
    const deleteButton = createButton("delete", "X");
    deleteButton.addEventListener("click", function(){
        questionsContainer.removeChild(this.parentElement.parentElement);
        console.log("removed this container.");
    });
    const moveButton = createButton("move", "|");
    options.appendChild(deleteButton);
    options.appendChild(moveButton);
    form.appendChild(options);
    questionsContainer.appendChild(form);
}
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

// On load of the page, we want to place a question for the user already there
generateQuestion();