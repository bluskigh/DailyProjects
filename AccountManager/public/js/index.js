const techImages = document.querySelectorAll("#tech section");
console.log(techImages);
// go over and add eventlistener
for (const image of techImages)
{
    const children = image.children;
    if (children.length >= 2)
    {
        image.addEventListener("mouseenter", function(){
            console.log("this has occured");
            // set the h4 to have the hovered class
            this.children[1].classList.toggle("techHovered");
        });
        image.addEventListener("mouseleave", function(){
            // remove that class
            this.children[1].classList.toggle("techHovered");
        });
    }
}
