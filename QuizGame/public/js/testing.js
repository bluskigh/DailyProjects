const questions = document.querySelectorAll(".question");
const questionsLength = questions.length; 
const resultContainer = document.querySelector("#result"); 
const subject = document.querySelector("#subject");

for (const question of questions) {
    const container = question.querySelectorAll(".questionContainer");
    for (const indiv of container) {
        indiv.addEventListener("mouseover", function(){
            indiv.style = subject.getAttribute("style");
        });
        indiv.addEventListener("mouseleave", function(){
            // null removes it and uses the old background color
            indiv.style.backgroundColor = null;
        });
    }
}

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

function selected(obj) {
    if (obj.parentElement.getAttribute("name") == "true")
        obj.parentElement.parentElement.setAttribute("correct", true);
    else { 
        obj.parentElement.parentElement.setAttribute("correct", false);
    }
    obj.parentElement.parentElement.setAttribute("name", "1");
}
