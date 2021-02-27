const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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
app.get("/", (req, res)=>{
  res.render("index");
});

app.get("/getQuestions", (req, res)=>{
  const available = ["The Sun", "21", "malloc(sizeof(int))", "points to a location in memory", "a bug in the actual system"];
  const questions = [
    {
      title: "What is the name of our star?",
      answer: "The Sun",
      wrong: getChoices(available, "The Sun")
    },
    {
      title: "How do you allocate memory in C?",
      answer: "malloc(sizeof(int))",
      wrong: getChoices(available, "malloc(sizeof(int))")
    }
  ];
  res.json(questions);
});

app.listen(3000, ()=>{console.log("listening on port 3000")});