let last = 0;
let newGifs = [];

////////// containers
const favoriteContainer = document.querySelectorAll("#favoriteContainer .result .column");
const sections = document.querySelectorAll(".result .column");

let individuals = null;

//////////// Query form
const query = document.querySelector("input[type=text]");
const queryButton = document.querySelector("button[type=submit]");
if (query)
{
    queryButton.addEventListener("click", function(){
        // todo remove the child nodes the the columns
        getGifs(false);
    });
}

function updateInvidiuals()
{
    // reset all the other inviduals 

    for (const gif of newGifs)
    {
        gif.addEventListener("mouseenter", function(){
            this.children[1].classList.toggle("informationHovered");
            this.children[1].style.visibility = "visible";
            this.children[0].classList.toggle("blurImage");
        });
        gif.addEventListener("mouseleave", function(){
            this.children[1].classList.toggle("informationHovered");
            this.children[1].style.visibility = "hidden";
            this.children[0].classList.toggle("blurImage");
        });

    }

    // if I continue to update all the indiv, then its going to have some overwritting problem, where it overlaps eventListeners,
    // and keeps piling them up one another.
    newGifs = [];
}

function addButtonFunctionality(button, current)
{
    button.addEventListener("click", function(){
        // if the button is liked currently, remove it from the database, and webpage
        if (this.classList.contains("liked"))
        {
            console.log(current._id);
            fetch("/removeFavorite", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json"
                }),
                body: JSON.stringify({
                    // gif_id, is the id in the database, helps identify what to remove from the database 
                    gif_id: current._id
                })
            })
            .then((r)=>r.json())
            .then((r)=>{
                if (r.success)
                {
                    // uncomment this line to remove the favorite gif from favorites.
                    // favoriteContainer.removeChild(this.parentElement.parentElement);
                }
                else
                {
                    alert("Was not able to remove your favorite");
                }
            })
            .catch(e=>console.log("Error"));
        }
        else
        {
            // adding to our favorites
            fetch("/favorite", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json"
                }),
                body: JSON.stringify(current)
            })
            .then((r)=>{
                console.log("this ran");
                // could not complete this transaction
            })
            .catch(e=>console.log("Error..."))
        }
        this.classList.toggle("liked");
    });
}

function addButtonsToSections(container, gifs, isFavorite)
{
    for (const gif in gifs)
    {
        // stores the current gif
        const current = gifs[gif];

        //// container div
        const div = document.createElement("div");
        div.classList.add("indiv");
        div.style.height = "fit-content";
        div.style.width = "100%";

        ////// image
        const image = document.createElement("img");
        image.src = current.url;
        image.style.height = "fit-content";
        image.style.width = "100%";

        ////// section .information 
        const sectionInformation = document.createElement("section");
        sectionInformation.classList.add("information");
        sectionInformation.style.height = current.height;

        ////// section h4
        const h4 = document.createElement("h4");
        h4.innerText = current.title;
        const a = document.createElement("a");
        a.innerText = "Link To Gif!";
        a.href = current.url;
        //////// section button
        const button = document.createElement("button");
        button.innerText = "<3";
        button.name = current.id;

        div.appendChild(image);
        sectionInformation.appendChild(h4);
        sectionInformation.appendChild(a);
        sectionInformation.appendChild(button);
        div.appendChild(sectionInformation);

        if (current.checked || isFavorite)
        {
            button.classList.add("liked");
        }

        // adding the button functionality
        addButtonFunctionality(button, current);

        // adding the current gif (with all its elements) to the columns.
        container[last%3].appendChild(div);
        newGifs.push(div);
        last += 1;
    } // end of for
}

// for trending, put trending past the / mark 
function getGifs(trending)
{
    let look = "/getSomething/trending"; 
    if (!trending)
    {
        look = "/getSomething/" + query.value;
    }
    else
    {
        console.log("Going to look for trending things!");
    }

    // fetch("/getSomething/trending")
    fetch(look)
    .then( (r)=>r.json() )
    .then( (r) => {
        const array = r.result;
        // add the buttons to sections container
        addButtonsToSections(sections, array, false);
        return r;
    })
    .then(r=>updateInvidiuals())
    .catch(e=>console.log("error", e));
}

if (document.location.pathname === "/")
{
    getGifs(true);
}
else if(document.location.pathname === "/favorite")
{
    individuals = document.querySelectorAll(".indiv");
    // get information from fravorites 
    // loop through the information, and set each to have a event listener
    fetch("/getFavorites")
    .then( (r)=>r.json() )
    .then( (r)=>{
        addButtonsToSections(favoriteContainer, r, true);
        updateInvidiuals();
    })
    .catch(e=>console.error(e));
}