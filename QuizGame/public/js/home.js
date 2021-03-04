const testContainer = document.querySelector("#tests"); 

const firstCol = document.querySelector("#firstColumn");
const secondCol = document.querySelector("#secondColumn");
const thirdCol = document.querySelector("#thirdColumn");

function appendToCol(index, item) {
    switch(index){
        case 0:
            firstCol.appendChild(item);
            break;
        case 1:
            secondCol.appendChild(item);
            break;
        case 2:
            thirdCol.appendChild(item);
            break;
        default:
            console.log("This was not supposed to happen");
            break;
    }
}

const testSection = document.querySelector("#testSection");
// on load, get all the tests that belong to the user
let tests = [];
let testsContainers = [];
fetch("/getTestInformation")
.then(async (r) => await r.json())
.then((r)=>{
    console.log(r);
    tests = r;
    if (tests) {
        let index = 0;
        for (const test of tests) {
            const form = document.createElement("form");
            form.setAttribute("action", "/test");
            form.setAttribute("method", "post");
            form.setAttribute("name", test._id);
            // to store temp information
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.classList.add("hidden");
            input.setAttribute("name", "testId");
            input.setAttribute("value", test._id);
            form.appendChild(input);
            const div = document.createElement("div");
            div.classList.add("indivContainer");
            const button = document.createElement("button");
            const bold = document.createElement("b");
            bold.innerText = test.subject;
            const testInfoDiv = document.createElement("div");
            testInfoDiv.classList.add("indiv");
            const h1 = document.createElement("h1");
            h1.innerText = test.title;
            const p = document.createElement("p");
            p.innerText = test.desc;
            testInfoDiv.appendChild(h1);
            testInfoDiv.appendChild(p);
            button.appendChild(bold);
            button.appendChild(testInfoDiv);
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteTest");
            deleteButton.innerText = "Delete Test"
            deleteButton.setAttribute("type", "button"); // type=button??? yeah i know, but it works... prevents the forom from submitting. Yes I am aware of e.preventDefault().... :| its complicated as to why I decided to do it this way.
            div.appendChild(button);
            div.appendChild(deleteButton);
            form.appendChild(div);
            // push the form onto the array, so I can move the items around with ease. 
            testsContainers.push(form);
            const colIndex = index % 3;
            appendToCol(colIndex, form);
            //////// TODO LEFT OFF: finish sorting... now you can move the forms around.

            deleteButton.addEventListener("click", function(){
                // get the current test id
                // send fetch request to delete this test
                fetch("/deleteTest", {
                    method: "POST",
                    headers: new Headers({
                        "content-type":"application/json"
                    }),
                    body: JSON.stringify({
                        testId: test._id,
                    })
                })
                .then(async (r)=>await r.json())
                .then((r)=>{
                    if (r.result) {
                        // did good, so remove from test section
                        this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
                        for (const t in tests) {
                            const curr = tests[t];
                            if (curr._id == test._id) {
                                tests.splice(t, 1);
                                testsContainers.splice(t, 1);
                            }
                        }
                    }
                    else {
                        alert("We could not remove this.");
                    }
                })
                .catch((e)=>{
                    console.error(e);
                })
            });
            index++;
        }
    } else {
        document.querySelector("#testMessage").classList.remove("hidden");
    }
})
.catch((e)=>{
    console.error(e);
})

/*
When sorting by subject, we are going to create containers, and we are going to fill each
container with tests under x subject.
*/
let stuff = {};
function subjectSort() {
    let index = 0;
    for (const test in tests) {
        const curr = tests[test];
        const subject = curr.subject;
        if (stuff[subject]) {
            stuff[subject].appendChild(testsContainers[test]);
        } else {
            const div = document.createElement("div");
            div.classList.add("subjectSort");
            const h2 = document.createElement("h2");
            h2.innerText = subject;
            div.appendChild(h2);
            div.appendChild(testsContainers[test]);
            appendToCol(index%3, div);
            stuff[subject] = div;
            index++;
        }
    }
}

function defaultSort() {
    // go through each, pop them out to the parents parent container,
    // and remove the current parentn's containers from existence (hide)

    let index = 0;
    for (const key in stuff) {
        for (const item of stuff[key].querySelectorAll(".indivContainer")) {
            const parentElement = item.parentElement.parentElement.parentElement;
            if (parentElement) {
                parentElement.removeChild(item.parentElement.parentElement);
            }
            // item.parentElement.parentElement.parentElement.appendChild(item);
            appendToCol(index % 3, testsContainers[index]);
            index++;
        }
    }
    stuff = {}
}

const sortingMethod = document.querySelector("#sortingMethod");
sortingMethod.addEventListener("change", function(){
    switch(sortingMethod.value) {
        case "subject":
            subjectSort();
            break;
        case "default":
            defaultSort();
            break;
        case "asc":
            dateAsc();
            break;
        case "des":
            break;
        default:
            console.log("Well.. this is awkward");
            break;
    }
});