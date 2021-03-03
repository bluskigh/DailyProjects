/*
On load, generate all the subjects currently available for the user.
*/
const messageContainer = document.querySelector("#message");
const messageButton = messageContainer.querySelector("#messageAction");
messageButton.disabled = true;
const subjectsContainer = document.querySelector("#subjects");
const emptyStatus = document.querySelector("#emptyStatus");
let bubbles = [];
let deleted = null;
const getBubbleById = (id)=>{
    for (const bubble of bubbles) {
        if (bubble.id == id)
            return bubble;
    }
};

function checkEmptyStatus () {
    // if bubbles is empty, and the message does not contain hidden, make it hidden.
    if (bubbles.length == 0 && !emptyStatus.classList.contains("hidden"))
        emptyStatus.classList.toggle("hidden");
} 

/*
Adds a bubble to the database.
*/
function addBubbleToDB(title, color)
{
    fetch("/addSubject", {
        method: "POST", 
        headers: new Headers({
            "content-type": "application/json"
        }),
        body: JSON.stringify({
            title, color
        })
    })
    .then(async (r)=>await r.json())
    .then((r)=>{
        if (r) {
            // everything went well add the thing to the container
            subjectsContainer.appendChild(createBubble(title, color, r.result));
            bubbles.push({title,color, id: r.result});
            resetAddForm();
        } else {
            console.log("Something went wrong");
        }
    })
    .catch((e)=>{
        console.error(e);
    })
}

messageButton.addEventListener("click", function(){
    addBubbleToDB(deleted.title, deleted.color);
    this.disabled = true;
    messageContainer.classList.toggle("hidden");
})

// BUBBLE? Is what a subject is called. It is going to be displayed as a bubble container.
function createBubble(title, color="white", id) {
    /*
    Available options, remove the button when clicking on it.
    When hovered, the button will turn red to indicate remove.
    */
    const temp = document.createElement("button");
    temp.setAttribute("name", id);
    temp.classList.add("bubble");
    temp.style.backgroundColor = color;
    temp.innerText = title;
    temp.addEventListener("mouseenter", function(){
        this.style.backgroundColor = "red";
    });
    temp.addEventListener("mouseleave", function(){
        this.style.backgroundColor = color;
    });
    temp.addEventListener("click", function(){
        // delete from container
        this.parentElement.removeChild(this);
        // make a fetch request to delete the button
        fetch("/deleteSubject", {
            method: "POST",
            headers: new Headers({
                "content-type":"application/json"
            }),
            body: JSON.stringify({
                subjectId: id
            })
        })
        .then(async (r)=>await r.json())
        .then((r)=>{
            if (r) {
                // add to the deleted
                // id from the local scope (function parameter)
                deleted = getBubbleById(id);
                for (const bubble in bubbles) {
                    if (bubbles[bubble].id == id)
                        bubbles.splice(bubble, 1);
                }
                messageButton.disabled = false;
                // show the message cotnainer
                ////// This message container code can be moved into a function, along with the click listener callback.
                messageContainer.classList.toggle("hidden");
                messageContainer.querySelector("#messageTitle").innerText = "Undo";
                // setTimeout(()=>{
                //     if (!messageContainer.classList.contains("hidden")) {
                //         messageContainer.classList.toggle("hidden");
                //     }
                //     deleted = null;
                // }, 8000);
            } else {
                console.log("Something went wrong in /deleteSubject");
            }
        })
        .catch((e)=>{
            console.error(e);
        })
    });
    return temp;
}

fetch("/getSubjects")
.then(async(r)=>await r.json())
.then((r)=>{
    // returns an array
    if (r) {
        for (const subject of r) {
            const temp = createBubble(subject.title, subject.color, subject._id);
            subjectsContainer.appendChild(temp);
            bubbles.push({title: subject.title, color: subject.color, id: subject._id})
        }
    } else {
        subjectMessage.classList.toggle("hidden");
    }
})
.catch((e)=>{
    console.log("Failed loading subjects");
})

// TODO: think about making the form universal
const addForm = document.querySelector("#addSubjectForm");
function resetAddForm(){
    if (!addForm.classList.contains("hidden")) {
        addForm.classList.toggle("hidden");
        addForm.querySelector("[type=text]").value = "";
    }
}
addForm.addEventListener("submit", function(e){
    e.preventDefault();
    const title = this.querySelector("[type=text]").value;
    const color = this.querySelector("[type=color]").value;
    this.classList.toggle("hidden");
    addBubbleToDB(title, color);
    // make a fetch request to add this subject
});
const addSubject = document.querySelector("#addMore");
addSubject.addEventListener("click", function(){
    addForm.classList.toggle("hidden");
});


/////////////// Random color picker
function generateRandomColor(){
    return Math.floor(Math.random()*15);
}
const calcCharCode = (subOperand) => String.fromCharCode(97+(Math.abs(10-subOperand)));
// lesssss, go! Something simple, but using ascii char codes, able to gen random color for color picker. Something small:) 
function genHexPair() {
    let first = generateRandomColor();
    let second = generateRandomColor();
    if (first > 9) {
        first = calcCharCode(first);
    }
    if (second > 9) {
        second = calcCharCode(second);
    }
    return first + '' + second;
}
genHexPair();
function randomColor() {
    const color = '#' + genHexPair() + genHexPair() + genHexPair();
    return color;
} 
const colorSubjectPicker = document.querySelector("[type=color]");
const changeColor = ()=>{
    setTimeout(()=>{
        colorSubjectPicker.setAttribute("value", randomColor());
        changeColor();
    }, 500);
}
changeColor();