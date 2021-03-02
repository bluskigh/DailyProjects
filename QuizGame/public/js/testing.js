const questions = document.querySelectorAll(".question");
let answered = new Array(questions.length);
for (const question of questions) {
    console.log(question.children);
}

let correct = 0;

const submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", function(){
    for (const index in questions) {
        const selected = questions[index];
        try  {
            if (selected.getAttribute("name") != '1') {
                alert("you did not select an option for question: " + index);
                return;
            }
        } catch(e) {
            // ignore it, some dumb bug
        }
    }

    let correct = 0;
    for (const question of questions) {
        if (question.getAttribute("correct") == "true") {
            correct++;
        }
    }
    
    // TODO display the score on the screen.
    console.log("Final score: " + (correct / questions.length) * 100 );
    // get the scores for everything
});

function selected(obj) {
    if (obj.parentElement.getAttribute("name") == "true")
        obj.parentElement.parentElement.setAttribute("correct", true);
    else { 
        obj.parentElement.parentElement.setAttribute("correct", false);
    }
    obj.parentElement.parentElement.setAttribute("name", "1");
}