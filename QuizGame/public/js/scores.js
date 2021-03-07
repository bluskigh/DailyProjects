const scoreContainers = document.querySelectorAll(".scoreContainer");
const hoverColor = "#2F6262";
for (const container of scoreContainers) {
    const hr = container.querySelector("hr");
    const h1 = container.querySelector("h1");
    container.addEventListener("mouseover", function(){
        h1.style.color = hoverColor;
        hr.style.color = hoverColor;
        hr.style.width = "25%";
    });
    container.addEventListener("mouseleave", function(){
        h1.style.color = null;
        hr.style.color = null;
        hr.style.width= "50%";
    });
}
