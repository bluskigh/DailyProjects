const questions = document.querySelectorAll(".question");
const questionsLength = questions.length; 
const resultContainer = document.querySelector("#result"); 

let answered = new Array(questionsLength);
for (const question of questions) {
    console.log(question.children);
}

let correct = 0;

function disableRadios() {
    console.log(questionsLength);
    for (const question of questions) {
        // get each input, and disable it
        for (let i = 1; i < question.children.length; i++) {
            const current = question.children[i].children[0];
            current.disabled = true;
        }
    }
}

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

    this.disabled = true;
    disableRadios();
    
    const finalScore = (correct / questionsLength) * 100;
    resultContainer.classList.toggle("hidden");
    resultContainer.children[0].innerText = "Grade: " +  finalScore;
});

const takeAgain = document.querySelector("#takeAgain");
takeAgain.addEventListener("click", function(){
    // reload the page
    window.location.reload(true);
});

function selected(obj) {
    if (obj.parentElement.getAttribute("name") == "true")
        obj.parentElement.parentElement.setAttribute("correct", true);
    else { 
        obj.parentElement.parentElement.setAttribute("correct", false);
    }
    obj.parentElement.parentElement.setAttribute("name", "1");
}
