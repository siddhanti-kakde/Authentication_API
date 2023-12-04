let headingE1 = document.getElementById("headingElement");
let changeBtnE1 = document.getElementById("changeBtn");

function onChangeheading(){
    headingE1.textContent = "4.0 Technologies";
    headingE1.style.color = "blue";
}

changeBtnE1.addEventListener(click,onChangeheading);