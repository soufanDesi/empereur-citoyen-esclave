import { getPlayers, getHistory, saveHistory } from "./storage.js";
import { updateActivePlayerName, initMobileMenu} from "./ui.js";

const players = getPlayers();
updateActivePlayerName(players);
initMobileMenu();

let history = getHistory();
const historyList = document.querySelector("#history-list");
console.log("Historique :", history);
const historySearch = document.querySelector("#history-search");
const historyResult = document.querySelector("#history-result");
const historyPeriod = document.querySelector("#history-period");
const historySort = document.querySelector("#history-sort");
const historyEmpty = document.querySelector("#history-empty");

const deleteModal = document.querySelector("#delete-history-modal");
let partieToDelete = null;

function renderHistory() {
    historyList.innerHTML = "";

    const searchValue = historySearch.value.trim().toLowerCase();
    const resultValue = historyResult.value;
    const periodValue = historyPeriod.value;
    const today = new Date();
    const sortValue = historySort.value;

    const filteredHistory = history.filter(function (partie) {
        const playerName = partie.playerName || "Joueur inconnu";
        const matchName = playerName.toLowerCase().includes(searchValue);
        const matchRresult = resultValue === "all" || partie.resultat === resultValue;

        let gameDate = null;

        if (partie.date) {
            gameDate = new Date(partie.date);
        } else {
            gameDate = null;
        }

        let matchPeriod = true;

        if (periodValue === "today") {
            if (gameDate === null) {
                matchPeriod = false;
            } else {
                matchPeriod = gameDate.getFullYear() === today.getFullYear() && gameDate.getMonth() === today.getMonth() && gameDate.getDate() === today.getDate();
            }
        }

        return matchName && matchRresult && matchPeriod;
    });

    filteredHistory.sort(function (a, b) {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (sortValue === "recent") {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    if (filteredHistory.length === 0) {
        historyEmpty.classList.remove("hidden");
    } else {
        historyEmpty.classList.add("hidden");
    }

    filteredHistory.forEach(function (partie) {
        const date = partie.date ? new Date(partie.date).toLocaleDateString("fr-FR") : "Date inconnue";
        const card = document.createElement("div");

        card.className = "bg-surface border border-border rounded-xl p-5";

        card.innerHTML = `
    <div class="flex justify-between items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold"></h2>
        <p class="text-muted text-xs">${date}</p>
    </div>

    <div class="border-t border-border pt-3 flex justify-between items-center gap-3">
        <div>
            <p class="text-muted text-xs mb-1">Score final</p>
            <p class="text-xl font-bold">
                ${partie.scoreJoueur} - ${partie.scorePC}
            </p>
        </div>

        <p class="text-sm font-medium">${partie.resultat}</p>
    </div>

    <div class="flex justify-end mt-3">
        <button type="button"
            class="delete-history-btn text-red-500 text-sm hover:text-red-400 cursor-pointer">
            Supprimer
        </button>
    </div>
`;

        card.querySelector("h2").textContent = partie.playerName || "Joueur inconnu";

        const deleteButton = card.querySelector(".delete-history-btn");

        deleteButton.addEventListener("click", function () {
            partieToDelete = partie;

            deleteModal.classList.remove("hidden");
            deleteModal.classList.add("flex");
        });

        historyList.appendChild(card);

    })
}

// cancel delet
const cancelDeleteButton = document.querySelector("#cancel-delete-history");

cancelDeleteButton.addEventListener("click", function () {
    partieToDelete = null;

    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");
});


const confirmDeleteButton = document.querySelector("#confirm-delete-history");

confirmDeleteButton.addEventListener("click", function () {
    if (partieToDelete === null) {
        return
    }

    history = history.filter(function (partie) {
        return partie !== partieToDelete;
    });

    saveHistory(history);

    partieToDelete = null;

    deleteModal.classList.add("hidden");
    deleteModal.classList.remove("flex");

    renderHistory();
});

historySearch.addEventListener("input", function () {
    renderHistory();
});

historyResult.addEventListener("change", function () {
    renderHistory();
});

historyPeriod.addEventListener("change", function () {
    renderHistory();
});

historySort.addEventListener("change", function () {
    renderHistory();
});

renderHistory();

