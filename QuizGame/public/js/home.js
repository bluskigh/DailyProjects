const testContainer = document.querySelector("#tests"); 

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
        for (const test of tests) {
            const form = document.createElement("form");
            form.setAttribute("action", "/test");
            form.setAttribute("method", "post");
            form.classList.add("indivContainer");
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
            testSection.appendChild(form);
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
                        testId: test._id
                    })
                })
                .then(async (r)=>await r.json())
                .then((r)=>{
                    if (r.result) {
                        // did good, so remove from test section
                        testContainer.removeChild(this.parentElement);
                    }
                    else {
                        alert("We could not remove this.");
                    }
                })
                .catch((e)=>{
                    console.error(e);
                })
            });

        }
    } else {
        document.querySelector("#testMessage").classList.remove("hidden");
    }
})
.catch((e)=>{
    console.error(e);
})

function subjectSort() {
}

const sortingMethod = document.querySelector("#sortingMethod");
sortingMethod.addEventListener("change", function(){

});