const express = require("express");
const Authorization = require("./Routers/authorization");
const ApplicationError = require("./secondary/ApplicationError");
const DeckModel = require("./models/DeckModel");
const session = require("express-session");
const path = require("path");
const app = express();


// Routers 
app.use(Authorization);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({secret: "secret"}));

const isIn = (array, item)=>{
  for (const i of array)
  {
    if (i === item)
      return true;
  }
  return false;
};

const getChoices = (available, right)=>{
  // get all wrong answers
  let wrongs = [];
  for (let i = 0; i < 3; i++)
  {
    let current = null;
    while (true)
    {
      // if the current number is equal to the correct and in the already selected, then keep trying to get another one
      const random = Math.floor(Math.random() * (available.length));
      current = available[random];
      if (!isIn(wrongs, current) && current != right) 
      {
        break;
      }
    }
    wrongs.push(current);
  }

  const rightIndex = Math.floor(Math.random() * 4);
  wrongs.splice(rightIndex, 0, right);
  
  // push the right randomly
  return wrongs;
};

const checkLoggedIn = (req, res, next)=>{
  if (req.session.userId) {
    res.render("home", {title: "Home", stylesheets: [], userId: req.session.userId});
  }
  return next();
};
app.get("/", checkLoggedIn, (req, res)=>{
  res.render("index", {title: "Quiz Application", stylesheets:["index.css"], userId: req.session.userId});
});

app.get("/getQuestions", checkLoggedIn, (req, res)=>{
  const available = ["The Sun", "21", "malloc(sizeof(int))", "points to a location in memory", "a bug in the actual system"];
  const questions = [
    {
      title: "What is the name of our star?",
      answer: "The Sun",
      choices: getChoices(available, "The Sun")
    },
    {
      title: "How do you allocate memory in C?",
      answer: "malloc(sizeof(int))",
      choices: getChoices(available, "malloc(sizeof(int))")
    }
  ];
  res.json(questions);
});

///// Decks
app.get("/addDeck", (req, res)=>{
  // TODO: add auth later, do not let people access this route unless they are signed in
  res.render("deck");
});
app.post("/addDeck", (req, res)=>{
  const { title, desc } = req.body;
  DeckModel.addDeck(title, desc, req.session.userId)
  .then((r)=>{
    // TODO when created, redirect the user to the page /user/deck/deck_id 
    console.log("Added to the decks");
    res.redirect("/");
  })
  .catch((e)=>{
    throw e;
  })
});

// expected to get via fetch.
app.get("/showDecks", (req, res)=>{
  // return back all the decks that belong to the current user.
  DeckModel.model.find({userId: req.session.userId})
  .then((r)=>{
    // should return an array of objects which represent each deck.
    res.json(r);
  })
  .catch((e)=>{
    throw e;
  })
});

app.post("/:deckId/addCard", (req, res)=>{
  const { deckId } = req.params;
  res.json({added: true});
});
// show the decks
app.get("/decks/:deckId", async (req, res)=>{
  const { deckId } = req.params;
  const deckInfo = await DeckModel.model.findOne({_id: deckId});
  console.log(deckInfo);
  if (deckInfo)
  {
    const cards = await DeckModel.findCards(deckId);
    res.render("deck", {cards, id: deckId, title: deckInfo.title, description: deckInfo.desc});
  }
  else
    throw new ApplicationError(e, 404);
});


app.get("*", (req, res)=>{
  res.redirect("/");
});

// Error handler 
app.use((err, req, res, next)=>{
  const { message="error", status=404, before="/" } = err;
  res.render("error", {message, status});
});

app.listen(3000, ()=>{console.log("listening on port 3000")});
