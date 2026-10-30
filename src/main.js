

// menu mobile affich
const menuT = document.querySelector("#menu-toggle");
const mobileM = document.querySelector("#mobile-menu");

menuT.addEventListener("click", function(){

mobileM.classList.toggle("hidden");
mobileM.classList.toggle("flex");

})

