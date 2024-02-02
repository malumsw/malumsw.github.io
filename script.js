document.addEventListener("DOMContentLoaded", function() {
    // Entry Animation
    const entranceContainer = document.querySelector('.entrance-container');
    const entranceTexts = document.querySelectorAll('.entrance-text');

    

    entranceContainer.style.animation = "fadeIn 1.5s forwards";

    entranceTexts.forEach((text, index) => {
        text.style.animation = `textAnimation 1s ease-in-out ${index * 2}s forwards`;

    
    });
});
window.onload = function(){
    var hiddensw = document.getElementsByClassName("hidestart");
    var containerstart = document.getElementById("startdiv")
    
    var header = document.getElementsByTagName('header')[0];

    var main = document.getElementsByTagName('main')[0];

    var footer = document.getElementsByTagName('footer')[0];
    
    setTimeout(() => {
        containerstart.style.display = "none";
        header.style.display = "block";
        main.style.display = "block";
        footer.style.display = "block";

        for (hiddenThing of hiddensw) {
            hiddenThing.classList.remove('hidestart');
    
        }
    }, 7500);
}



// window.onload = function() {
//     const fadeInElement = document.querySelector('.fade-in');
//     setTimeout(() => {
//       fadeInElement.style.opacity = 1;
//     }, 1000);
//   }