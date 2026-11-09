import { getPlayers, saveCurrentGame, getCurrentGame, getHistory, saveHistory } from "./storage.js";
import { updateActivePlayerName, initMobileMenu } from "./ui.js";
import { createHand, getPlayerCamp, getComputerCamp, chooseComputerCard, duel, removePlayedCard, updateScore, nextRound, switchFirstCamp } from "./game.js";
initMobileMenu();
const players = getPlayers();

updateActivePlayerName(players);

let manche = 1;
let scoreJoueur = 0;
let scorePC = 0;

let campJoueur;
let campPC;

let mainJoueur;
let mainPC;

let lastPlayerCard = null;
let lastComputerCard = null;
let lastResult = null;

let premierCamp = "Empereur";
let cartePCEnAttente = null;

let duelEncour = false;


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
    updateFirstCamp();
    prepareComputerCard();
    saveGameState();
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

function updateFirstCamp() {
    document.querySelector("#first-camp").textContent = premierCamp;
}

function prepareComputerCard() {
    cartePCEnAttente = null;

    if (premierCamp === campPC) {
        cartePCEnAttente = chooseComputerCard(mainPC);
        removePlayedCard(mainPC, cartePCEnAttente);
        renderComputerCards();

        document.querySelector("#duel-computer").innerHTML =
            `<img src="./assets/images/CardBack.png" alt="Carte cachée" class="w-full h-full object-contain">`;
    }
}

let mancheTerminee = false;

function playDuel(carteJoueur) {

    if (mancheTerminee || duelEncour) {
        return;
    }
    duelEncour = true;

    const pcDejaJoue = cartePCEnAttente !== null;
    const cartePC = cartePCEnAttente ?? chooseComputerCard(mainPC);
    cartePCEnAttente = null;

    const resultat = duel(carteJoueur, cartePC);

    lastPlayerCard = carteJoueur;
    lastComputerCard = cartePC;
    lastResult = resultat;

    removePlayedCard(mainJoueur, carteJoueur);

    if (!pcDejaJoue) {
        removePlayedCard(mainPC, cartePC);
    }
    showHiddenDuelCards();
    setTimeout(function () {
        renderDuelCards(carteJoueur, cartePC);

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

    }, 600)
    // renderDuelCards(carteJoueur, cartePC);

    console.log("Joueur :", carteJoueur)
    console.log("Ordinateur :", cartePC);
    console.log("Résultat :", resultat)

    renderPlayerCards();
    renderComputerCards();

    // if (resultat !== "egalite") {
    //     mancheTerminee = true;
    //     nextRoundButton.classList.remove("hidden");

    //     const scores = updateScore(resultat, campJoueur, campPC, scoreJoueur, scorePC);

    //     scoreJoueur = scores.scoreJoueur;
    //     scorePC = scores.scorePC;

    //     console.log("Score joueur :", scoreJoueur);
    //     console.log("Score PC :", scorePC);
    //     updateScoreDisplay();
    // }

    if (resultat === "egalite") {
        setTimeout(function () {
            resetDuelZone();
            premierCamp = switchFirstCamp(premierCamp);
            updateFirstCamp();

            prepareComputerCard();
            duelEncour = false;
            saveGameState();
        }, 2400)

    } else {
        setTimeout(function () {
            duelEncour = false;
            saveGameState();

        }, 600)

    }
}

function renderDuelCards(carteJoueur, cartePC) {
    const duelPlayer = document.querySelector("#duel-player");
    const duelComputer = document.querySelector("#duel-computer");

    duelPlayer.innerHTML = `
        <img src="./assets/images/${carteJoueur}.png" alt="${carteJoueur}" class="w-full h-full object-contain animate-card-flip">
    `;

    duelComputer.innerHTML = `
        <img src="./assets/images/${cartePC}.png" alt="${cartePC}" class="w-full h-full object-contain animate-card-flip">
    `;
}


function resetDuelZone() {
    document.querySelector("#duel-player").textContent = "?";
    document.querySelector("#duel-computer").textContent = "?";
}

function showHiddenDuelCards() {
    const cardBack = ' <img src="./assets/images/CardBack.png" alt="Carte cachée" class="w-full h-full object-contain">'

    document.querySelector("#duel-player").innerHTML = cardBack;
    document.querySelector("#duel-computer").innerHTML = cardBack;
}

nextRoundButton.addEventListener("click", function () {
    const nouvelleManche = nextRound(manche);

    lastPlayerCard = null;
    lastComputerCard = null;
    lastResult = null;

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


    nextRoundButton.classList.add("hidden");


    premierCamp = switchFirstCamp(premierCamp);
    updateFirstCamp();

    resetDuelZone();

    prepareComputerCard();

    saveGameState();
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

    const history = getHistory();

    const activePlayerId = localStorage.getItem("ece_active_player");
    const activePlayer = players.find(function (player) {
        return player.id === activePlayerId;
    })

    const partie = {
        id: "g_" + Date.now(),
        playerId: activePlayer.id,
        playerName: activePlayer.nickname,
        scoreJoueur: scoreJoueur,
        scorePC: scorePC,
        resultat: finalResult.textContent,
        date: new Date().toISOString()
    }
    history.push(partie);
    saveHistory(history);
}

const replayButton = document.querySelector("#replay-btn");

replayButton.addEventListener("click", function () {
    localStorage.removeItem("ece_current_game");
    window.location.reload();
})


function saveGameState() {
    const game = { playerId: localStorage.getItem("ece_active_player"), manche: manche, scoreJoueur: scoreJoueur, scorePC: scorePC, campJoueur: campJoueur, campPC: campPC, mainJoueur: mainJoueur, mainPC: mainPC, mancheTerminee: mancheTerminee, premierCamp: premierCamp, cartePCEnAttente: cartePCEnAttente, lastPlayerCard: lastPlayerCard, lastComputerCard: lastComputerCard, lastResult: lastResult };

    saveCurrentGame(game);
}

function restoreGameState() {
    const game = getCurrentGame();
    if (!game) {
        return;
    }

    const activePlayerId = localStorage.getItem("ece_active_player");

    if (game.playerId !== activePlayerId) {
        return;
    }

    manche = game.manche;
    scoreJoueur = game.scoreJoueur;
    scorePC = game.scorePC;
    campJoueur = game.campJoueur;
    campPC = game.campPC;

    mainJoueur = game.mainJoueur;
    mainPC = game.mainPC;

    mancheTerminee = game.mancheTerminee;
    premierCamp = game.premierCamp;
    cartePCEnAttente = game.cartePCEnAttente ?? null;

    lastPlayerCard = game.lastPlayerCard;
    lastComputerCard = game.lastComputerCard;
    lastResult = game.lastResult;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    updateGameInfo();
    updateScoreDisplay();
    renderPlayerCards();
    renderComputerCards();
    updateFirstCamp();

    resetDuelZone();

    if (mancheTerminee && lastPlayerCard && lastComputerCard) {
        renderDuelCards(lastPlayerCard, lastComputerCard);
        nextRoundButton.classList.remove("hidden");

    } else if (cartePCEnAttente !== null) {
        document.querySelector("#duel-computer").innerHTML = ` 
        <img src="./assets/images/CardBack.png" alt="Carte cachée" class="w-full h-full object-contain">
    `;
    }
}
restoreGameState();