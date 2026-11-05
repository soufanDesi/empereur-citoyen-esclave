import { getPlayers } from "./storage.js";
import { updateActivePlayerName } from "./ui.js";
import { createHand, getPlayerCamp, getComputerCamp, chooseComputerCard, duel, removePlayedCard, updateScore, nextRound } from "./game.js";

const players = getPlayers();

updateActivePlayerName(players);

let manche = 1;
let scoreJoueur = 0;
let scorePC = 0;

let campJoueur;
let campPC;

let mainJoueur;
let mainPC;

const nextRoundButton = document.querySelector("#next-round-btn");

function updateScoreDisplay() {
    document.querySelector("#player-score").textContent = scoreJoueur;
    document.querySelector("#computer-score").textContent = scorePC;
}



function startGame() {
    mancheTerminee = false;
    campJoueur = getPlayerCamp(manche);
    campPC = getComputerCamp(campJoueur);
    mainJoueur = createHand(campJoueur);
    mainPC = createHand(campPC);
}

function updateGameInfo() {
    document.querySelector("#manche-number").textContent = manche;
    document.querySelector("#player-camp").textContent = campJoueur;
    document.querySelector("#group-number").textContent = Math.ceil(manche / 3);
}


const startButton = document.querySelector("#start-game-btn");
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const startError = document.querySelector("#start-error");

startButton.addEventListener("click", function () {
    const activePlayerId = localStorage.getItem("ece_active_player");

    const activePlayer = players.find(function (player) {
        return player.id === activePlayerId
    })

    if (!activePlayer) {
        startError.classList.remove("hidden");
        return
    }

    startGame();

    startError.classList.add("hidden");
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    updateGameInfo()
    renderPlayerCards();
    renderComputerCards();
})


function renderPlayerCards() {
    const playerCards = document.querySelector("#player-cards");

    playerCards.innerHTML = "";

    mainJoueur.forEach(function (carte) {
        const card = `
            <div class="w-14 h-20 sm:w-20 sm:h-28">
                <button data-carte="${carte}" type="button"
                    class="player-card-btn w-full h-full hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                    <img src="./assets/images/${carte}.png" alt="${carte}" class="w-full h-full object-contain">
                </button>
            </div>
        `;
        playerCards.innerHTML += card;

    });

    const cardButtons = document.querySelectorAll(".player-card-btn");

    cardButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCard = button.dataset.carte;

            playDuel(selectedCard);
        });
    });


}





function renderComputerCards() {
    const computerCards = document.querySelector("#computer-cards");

    computerCards.innerHTML = "";

    mainPC.forEach(function () {
        const card = `
            <div class="w-14 h-20 sm:w-20 sm:h-28">
                <img src="./assets/images/CardBack.png"
                     alt="Carte cachée"
                     class="w-full h-full object-contain">
            </div>
        `;

        computerCards.innerHTML += card;
    });
}

let mancheTerminee = false;

function playDuel(carteJoueur) {

    if (mancheTerminee) {
        return;
    }
    const cartePC = chooseComputerCard(mainPC);

    const resultat = duel(carteJoueur, cartePC);

    removePlayedCard(mainJoueur, carteJoueur);
    removePlayedCard(mainPC, cartePC);

    renderDuelCards(carteJoueur, cartePC);

    console.log("Joueur :", carteJoueur)
    console.log("Ordinateur :", cartePC);
    console.log("Résultat :", resultat)

    renderPlayerCards();
    renderComputerCards();

    if (resultat !== "egalite") {
        mancheTerminee = true;
        nextRoundButton.classList.remove("hidden");

        const scores = updateScore(resultat, campJoueur, campPC, scoreJoueur, scorePC);

        scoreJoueur = scores.scoreJoueur;
        scorePC = scores.scorePC;

        console.log("Score joueur :", scoreJoueur);
        console.log("Score PC :", scorePC);
        updateScoreDisplay();
    }

}

function renderDuelCards(carteJoueur, cartePC) {
    const duelPlayer = document.querySelector("#duel-player");
    const duelComputer = document.querySelector("#duel-computer");

    duelPlayer.innerHTML = `
        <img src="./assets/images/${carteJoueur}.png" alt="${carteJoueur}" class="w-full h-full object-contain">
    `;

    duelComputer.innerHTML = `
        <img src="./assets/images/${cartePC}.png" alt="${cartePC}" class="w-full h-full object-contain">
    `;
}


nextRoundButton.addEventListener("click", function () {
    const nouvelleManche = nextRound(manche);

    if (nouvelleManche === null) {
        console.log("Fin de partie");
        endGame();
        return;
    }

    manche = nouvelleManche;

    startGame();
    updateGameInfo();
    renderPlayerCards();
    renderComputerCards();

    document.querySelector("#duel-player").textContent = "?";
    document.querySelector("#duel-computer").textContent = "?";

    nextRoundButton.classList.add("hidden");
});



function endGame() {
    gameScreen.classList.add("hidden");

    const endScreen = document.querySelector("#end-screen");
    endScreen.classList.remove("hidden");

    const finalResult = document.querySelector("#final-result");

    if (scoreJoueur > scorePC) {
        finalResult.textContent = "Victoire !";
    } else if (scoreJoueur < scorePC) {
        finalResult.textContent = "Défaite !";
    } else {
        finalResult.textContent = "Égalité !";
    }

    document.querySelector("#final-player-score").textContent = scoreJoueur;
    document.querySelector("#final-computer-score").textContent = scorePC;
}

