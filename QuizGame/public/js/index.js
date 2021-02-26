const start = document.querySelector("#start");
const done = document.querySelector("#done");
const total = 2; // 4 questions
let correct = 0;
let answered = 0;

start.addEventListener("click", function(){
    // make a fetch request to the server, get questions and andswers to each question back.
    // create dom elements
    // start the test
    console.log("start button click");
});
done.addEventListener("click", function(){
    if (answered == total)
    {
        console.log("Final score: ", ((correct / total) * 100));
    }
    else
    {
        alert("You have to answer all the questions." + answered);
    }
});

// to prevent the user from answering again, either removeEventLIstener, or disable
function question(obj)
{
    let first = true;
    if (answered != total)
    {
        const questions = obj.parentElement.children;
        for (const question of questions)
        {
            if (question.disabled)
            {
                first = false;
                break;
            }
        }
        
        if (first)
            answered += 1;
    }
    else { first = false; }

    const name = obj.getAttribute("name");
    if (name && name.indexOf("correct")>=0) 
    {
        // clicked on the correct answer, make it look like so.
        obj.classList.add("correct");
        if (first)
            correct += 1;
    }
    else
        obj.classList.add("incorrect");

    // disable the button from being clicked again, remove this... to get an easy mode feature
    obj.setAttribute("disabled", true);
}
