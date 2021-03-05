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
    r = r.filter((item)=>item.subject);
    if (tests) {
        let index = 0;
        for (const test of r) {
            if (test.subject) {
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
                div.classList.add("bubble");
                div.style.borderColor = test.subject.color;

                const mainButton = document.createElement("button");
                mainButton.classList.add("mainbutton");

                const bold = document.createElement("b");
                bold.innerText = test.subject.title;
                bold.style.backgroundColor = test.subject.color;
                mainButton.appendChild(bold);

                const bubbleTestInfo = document.createElement("div"); 
                bubbleTestInfo.classList.add("bubbleTestInfo");
                mainButton.appendChild(bubbleTestInfo);

                const testInfo = document.createElement("div");
                testInfo.classList.add("testInfo");
                bubbleTestInfo.appendChild(testInfo);

                const h2 = document.createElement("h2");
                h2.classList.add("testTitle");
                h2.innerText = test.title;

                const p = document.createElement("p");
                p.innerText = test.desc;
                testInfo.appendChild(h2);
                testInfo.appendChild(p);

                const deleteButton = document.createElement("div");
                const deleteBold = document.createElement("b"); 
                deleteButton.classList.add("deleteButton");
                deleteBold.innerText = "X"
                deleteButton.appendChild(deleteBold);
                bubbleTestInfo.appendChild(deleteButton);
                bubbleTestInfo.appendChild(deleteButton);

                div.appendChild(mainButton);
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
            } else {
            }
        }
        tests = r;
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
        if (curr.subject) {
            const subject = curr.subject;
            console.log(subject);
            if (stuff[subject.title]) {
                stuff[subject.title].appendChild(testsContainers[test]);
            } else {
                const div = document.createElement("div");
                div.classList.add("subjectSort");
                const h2 = document.createElement("h2");
                h2.innerText = subject.title;
                div.appendChild(h2);
                div.appendChild(testsContainers[test]);
                appendToCol(index%3, div);
                stuff[subject.title] = div;
                index++;
            }

        }
    }
}

function defaultSort() {
    // go through each, pop them out to the parents parent container,
    // and remove the current parentn's containers from existence (hide)
    let index = 0;
    for (const key in stuff) {
        const current = stuff[key];
        const query = current.querySelectorAll(".bubble");
        for (const q of query) {

            if (current.parentElement)
                current.parentElement.removeChild(current);
            appendToCol(index % 3, q);
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