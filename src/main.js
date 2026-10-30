

// menu mobile affich
const menuT = document.querySelector("#menu-toggle");
const mobileM = document.querySelector("#mobile-menu");

menuT.addEventListener("click", function () {

    mobileM.classList.toggle("hidden");
    mobileM.classList.toggle("flex");

});

// ajouter un joueur
const addPlayerButton = document.querySelector("#add-player-btn");
const playerModal = document.querySelector("#player-modal");

addPlayerButton.addEventListener("click", function () {
    playerModal.classList.remove("hidden");
    playerModal.classList.add("flex");
});

// close ajouter un joueur
const closePlayerModalButton = document.querySelector("#close-player-modal");

closePlayerModalButton.addEventListener("click", function () {
    playerModal.classList.add("hidden");
    playerModal.classList.remove("flex");
});

// cancel :annuler
const cancelPlayerButton = document.querySelector("#cancel-player-btn");

cancelPlayerButton.addEventListener("click", function () {
    playerModal.classList.add("hidden");
    playerModal.classList.remove("flex");
});

const playerForm = document.querySelector("#player-form");
const pseudoInput = document.querySelector("#pseudo");
const avatarButtons = document.querySelectorAll(".avatar-option");
let selectedAvatar = null;

playerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nickname = pseudoInput.value.trim();
    console.log(nickname);
    console.log("MAIN JS LOADED");

})
