// who da hell put this in my super suit?
// const { Http2ServerRequest } = require("http2");
const start = document.querySelector("#start");
const done = document.querySelector("#done");
const show = document.querySelector("#show");
const deckContainer = document.querySelector("#decks");
const result = document.querySelector("#result");
const container = document.querySelector("section"); 
let total = 0; // 4 questions
let correct = 0;
let answered = 0;

const loadDecks = ()=>{
  // everytime we load, we want to add to the current container, so loop through each deck, if its already in the deck, don't boter
  // adding.
    // make fetch request to /showDecks
    fetch("/showDecks")
    .then(async (r)=>{
      const data = await r.json();
      console.log(data);
      for (const d of data) 
      {
          const div = document.createElement("div");
          div.setAttribute("name", d._id);
          div.addEventListener("click", function(){
              document.location.href = "/decks/" + d._id;
          });
          const h2 = document.createElement("h2");
          h2.innerText = d.title;
          const p = document.createElement("p");
          p.innerText = d.desc;
          const bold = document.createElement("bold");
          bold.innerText = d.cards;

          div.appendChild(h2);
          div.appendChild(p);
          div.appendChild(bold);

          deckContainer.appendChild(div);
      }
    })
    .catch(e=>{console.error(e)});
};

show.addEventListener("click", function(){
    loadDecks();
});

// to prevent the user from answering again, either removeEventLIstener, or disable
function question()
{
    let first = true;
    if (answered != total)
    {
        const questions = this.parentElement.children;
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

    const name = this.getAttribute("name");
    if (name && name.indexOf("correct")>=0) 
    {
        // clicked on the correct answer, make it look like so.
        this.classList.add("correct");
        if (first)
            correct += 1;
    }
    else
        this.classList.add("incorrect");

    // disable the button from being clicked again, remove this... to get an easy mode feature
    this.setAttribute("disabled", true);
}


start.addEventListener("click", function(){
    // make a fetch request to the server, get questions and andswers to each question back.
    // create dom elements
    // start the test
    // TODO: make this post, since we gogin to pass the current deck id, and user id.
    fetch("/getQuestions")
    .then(async (r)=> await r.json())
    .then((r)=>{
        // TOD : create container for the questions and answers.
        // q = question
        total = 0;
        for (const q of r)
        {
            const div = document.createElement("div");
            div.classList.add("question");
            const h1 = document.createElement("h1");
            h1.innerText = q.title;
            div.appendChild(h1);
            const choices = q.choices;
            for (const choice of choices)
            {
                const temp = document.createElement("button");
                if (q.answer == choice) 
                    temp.setAttribute("name", "correct");
                temp.addEventListener("click", question);
                temp.innerText = choice;
                // add to the container
                div.appendChild(temp);
            }
            container.appendChild(div);
            total+=1;
        }
    })
    .catch((e)=>{
        console.error(e);
    })
});
done.addEventListener("click", function(){
    if (answered == total)
    {
        const finalScore = ((correct/total) * 100);
        result.innerText = finalScore;
    }
    else
    {
        alert("You have to answer all the questions." + answered);
    }
});

