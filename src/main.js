import { addPlayer, validateEditPlayer } from "./players.js";
import { getPlayers, savePlayers, getHistory, saveHistory } from "./storage.js"
import { updateActivePlayerName, initMobileMenu} from "./ui.js";

initMobileMenu();

// ajouter un joueur
const addPlayerButton = document.querySelector("#add-player-btn");
const playerModal = document.querySelector("#player-modal");

// modifier
const editPseudoInput = document.querySelector("#edit-pseudo");

const editAvatarButtons = document.querySelectorAll(".edit-avatar-option");
let selectedEditAvatar = null;
let editingPlayerId = null;


editAvatarButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        editAvatarButtons.forEach(function (avatarButton) {
            avatarButton.classList.remove("border-primary");
            avatarButton.classList.add("border-border");
        });


        selectedEditAvatar = button.dataset.avatar;
        button.classList.remove("border-border");
        button.classList.add("border-primary");
    })



})

const emptyPlayers = document.querySelector("#empty-players");

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

// close modefi un joueur

const editPlayerModal = document.querySelector("#edit-player-modal");
const editClosePlayerModalButton = document.querySelector("#close-edit-player-modal");

editClosePlayerModalButton.addEventListener("click", function () {
    editPlayerModal.classList.add("hidden");
    editPlayerModal.classList.remove("flex");
});


// cancel :annuler
const cancelPlayerButton = document.querySelector("#cancel-player-btn");

cancelPlayerButton.addEventListener("click", function () {
    playerModal.classList.add("hidden");
    playerModal.classList.remove("flex");
});

// cancel :annuler edite Player
const editiCancelPlayerButton = document.querySelector("#cancel-edit-player-btn");

editiCancelPlayerButton.addEventListener("click", function () {
    editPlayerModal.classList.add("hidden");
    editPlayerModal.classList.remove("flex");
});

const playerForm = document.querySelector("#player-form");
const editePlayerForm = document.querySelector("#edit-player-form");
const pseudoInput = document.querySelector("#pseudo");
const avatarButtons = document.querySelectorAll(".avatar-option");
const editpseudoHint = document.querySelector("#edit-pseudo-hint");
let selectedAvatar = null;
const pseudoHint = document.querySelector("#pseudo-hint");

avatarButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        avatarButtons.forEach(function (avatarButton) {
            avatarButton.classList.remove("border-primary");
            avatarButton.classList.add("border-border");
        });


        selectedAvatar = button.dataset.avatar;
        button.classList.remove("border-border");
        button.classList.add("border-primary");
    })



})


// Vérifier name blur
const regexNickname = /^[A-Za-z0-9]{3,15}$/;

pseudoInput.addEventListener("blur", function () {
    const nickname = pseudoInput.value.trim();

    if (!regexNickname.test(nickname)) {
        pseudoInput.classList.remove("border-border");
        pseudoInput.classList.remove("border-green-500");
        pseudoInput.classList.add("border-red-500");

        pseudoHint.textContent = "Pseudo invalide : 3 à 15 lettres ou chiffres.";
        pseudoHint.classList.remove("text-muted");
        pseudoHint.classList.remove("text-green-500");
        pseudoHint.classList.add("text-red-500");
    } else {
        pseudoInput.classList.remove("border-border");
        pseudoInput.classList.remove("border-red-500");
        pseudoInput.classList.add("border-green-500");

        pseudoHint.textContent = "Pseudo valide";
        pseudoHint.classList.remove("text-muted");
        pseudoHint.classList.remove("text-red-500");
        pseudoHint.classList.add("text-green-500");
    }

})









// Vérifier all name avatar and creat player
playerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nickname = pseudoInput.value.trim();
    const result = addPlayer(nickname, selectedAvatar);
    console.log(result);

    if (result.error) {
        pseudoInput.classList.remove("border-border");
        pseudoInput.classList.remove("border-green-500");
        pseudoInput.classList.add("border-red-500");

        pseudoHint.textContent = result.error;
        pseudoHint.classList.remove("text-muted");
        pseudoHint.classList.remove("text-green-500");
        pseudoHint.classList.add("text-red-500");
    } else {
        pseudoInput.classList.remove("border-border");
        pseudoInput.classList.remove("border-red-500");
        pseudoInput.classList.add("border-green-500");

        pseudoHint.textContent = "Profil créé avec succès !";
        pseudoHint.classList.remove("text-muted");
        pseudoHint.classList.remove("text-red-500");
        pseudoHint.classList.add("text-green-500");

        renderPlayers();

        playerModal.classList.add("hidden");
        playerModal.classList.remove("flex");

        playerForm.reset();

        pseudoHint.textContent = "3 à 15 caractères, lettres et chiffres uniquement.";
        pseudoHint.classList.remove("text-green-500", "text-red-500");
        pseudoHint.classList.add("text-muted");

        pseudoInput.classList.remove("border-green-500", "border-red-500");
        pseudoInput.classList.add("border-border");

        selectedAvatar = null;

        avatarButtons.forEach(function (avatarButton) {

            avatarButton.classList.remove("border-primary");
            avatarButton.classList.add("border-border");

        });

    }

})



// Vérifier all name avatar and modifier player

editePlayerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newNickname = editPseudoInput.value.trim();
    console.log(newNickname)
    console.log(selectedEditAvatar)
    console.log(editingPlayerId)

    const players = getPlayers();
    console.log(players);

    const playerToUpdate = players.find(function (playEdit) {
        return playEdit.id === editingPlayerId;
    })
    console.log(playerToUpdate);
    if (!playerToUpdate) {
        return;
    }

    const editeResult = validateEditPlayer(newNickname, selectedEditAvatar, editingPlayerId)

    if (editeResult.error) {
        editPseudoInput.classList.remove("border-border");
        editPseudoInput.classList.remove("border-green-500");
        editPseudoInput.classList.add("border-red-500");

        editpseudoHint.textContent = editeResult.error;
        editpseudoHint.classList.remove("text-muted");
        editpseudoHint.classList.remove("text-green-500");
        editpseudoHint.classList.add("text-red-500");
    } else {
        editPseudoInput.classList.remove("border-border");
        editPseudoInput.classList.remove("border-red-500");
        editPseudoInput.classList.add("border-green-500");

        editpseudoHint.textContent = "Profil modifié avec succès !";
        editpseudoHint.classList.remove("text-muted");
        editpseudoHint.classList.remove("text-red-500");
        editpseudoHint.classList.add("text-green-500");



        const history = getHistory();

        history.forEach(function (partie) {
            if (partie.playerId === editingPlayerId || (!partie.playerId && partie.playerName === playerToUpdate.nickname)) {
                partie.playerName = newNickname;
            }
        });

        saveHistory(history);

        playerToUpdate.nickname = newNickname;
        playerToUpdate.avatar = selectedEditAvatar;

        savePlayers(players)
        renderPlayers();

        editPlayerModal.classList.add("hidden");
        editPlayerModal.classList.remove("flex");

        editpseudoHint.textContent = "3 à 15 caractères, lettres et chiffres uniquement.";
        editpseudoHint.classList.remove("text-green-500", "text-red-500");
        editpseudoHint.classList.add("text-muted");

        editPseudoInput.classList.remove("border-green-500", "border-red-500");
        editPseudoInput.classList.add("border-border");

    }
})










const playerListe = document.querySelector("#players-list");
const deletePlayerModal = document.querySelector("#delete-player-modal");
let playerToDeleteId = null;


function renderPlayers() {
    const player = getPlayers();


    if (player.length === 0) {
        emptyPlayers.classList.remove("hidden");
        emptyPlayers.classList.add("flex");
    } else {
        emptyPlayers.classList.add("hidden");
        emptyPlayers.classList.remove("flex");
    }

    const activePlayerId = localStorage.getItem("ece_active_player");
    updateActivePlayerName(player);

    playerListe.innerHTML = "";


    player.forEach(function (player) {

        const isActive = player.id === activePlayerId;
        let status;
        let buttonText;
        let buttonDisabled;
        let buttonColor;
        let statusColor;

        if (isActive) {
            status = "Actif";
            buttonText = "Sélectionné";
            buttonDisabled = "disabled";
            buttonColor = "bg-gray-200 border border-gray-300 text-gray-600";
            statusColor = "text-green-500";

        } else {
            status = "Inactif";
            buttonText = "Sélectionner";
            buttonDisabled = "";
            buttonColor = "bg-primary text-background";
            statusColor = "text-muted";
        }

        const card = `
    <article class="bg-surface border border-border rounded-xl p-4">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
                <img
                    class="border border-border rounded-full p-0.5 w-10 h-10"
                    src="./assets/images/${player.avatar}"
                    alt="Avatar">

                <div>
                    <h2 class="font-semibold">${player.nickname}</h2>
                    <p class="text-muted text-sm">
                        <span>0</span> parties jouées
                    </p>
                </div>
            </div>
            <p class="${statusColor} text-xs font-medium">${status}</p>
        </div>

        <div class="flex gap-2 mt-4 pt-4 border-t border-border">
            <button data-id="${player.id}" ${buttonDisabled} class="select-player-btn flex-1 ${buttonColor}  rounded-lg py-2 font-medium">
                ${buttonText}
            </button>

            <button type="button" data-id="${player.id}"class="edit-player-btn border border-border rounded-lg px-4 py-2 hover:bg-border transition-colors">
                Modifier
            </button>

            <button type="button" data-id="${player.id}" class="delete-player-btn border border-border rounded-lg p-2 hover:bg-red-500/20 transition-colors">
                <img class="w-5 h-5" src="./assets/images/image.png" alt="Supprimer">
            </button>
        </div>
    </article>
`;
        playerListe.innerHTML += card;
    })

    const selectButtons = document.querySelectorAll(".select-player-btn");
    const deleteButtons = document.querySelectorAll(".delete-player-btn");
    const editButtons = document.querySelectorAll(".edit-player-btn");

    selectButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            localStorage.setItem("ece_active_player", button.dataset.id)
            renderPlayers();

        })

    })
    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            playerToDeleteId = button.dataset.id;

            deletePlayerModal.classList.remove("hidden");
            deletePlayerModal.classList.add("flex");



            //     const playerToDelete = player.find(function (play) {
            //         return play.id === button.dataset.id;
            //     });

            //     if (!playerToDelete) return;

            //     const history = getHistory();

            //     history.forEach(function (partie) {
            //         if (partie.playerName === playerToDelete.nickname) {
            //             partie.playerName = "Joueur supprimé";
            //             console.log("Joueur supprimé :", playerToDelete);
            //             console.log("Historique avant suppression :", history);
            //         }
            //     });

            //     saveHistory(history);

            //     const remainingPlayers = player.filter(function (play) {
            //         return play.id !== button.dataset.id;
            //     });

            //     savePlayers(remainingPlayers);
            //     renderPlayers();
        });
    });

    editButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            console.log(button.dataset.id);

            editPlayerModal.classList.remove("hidden");
            editPlayerModal.classList.add("flex");

            const playerToEdit = player.find(function (playr) {
                return playr.id === button.dataset.id;
            })
            editPseudoInput.value = playerToEdit.nickname;
            selectedEditAvatar = playerToEdit.avatar;
            editingPlayerId = button.dataset.id;
            console.log(playerToEdit.nickname);

            editAvatarButtons.forEach(function (avatarButton) {
                if (playerToEdit.avatar === avatarButton.dataset.avatar) {

                    avatarButton.classList.remove("border-border");
                    avatarButton.classList.add("border-primary");

                } else {

                    avatarButton.classList.remove("border-primary");
                    avatarButton.classList.add("border-border");

                }

            })



        });
    });

}
renderPlayers();

const cancelDeletePlayerButton = document.querySelector("#cancel-delete-player");

cancelDeletePlayerButton.addEventListener("click", function () {
    playerToDeleteId = null;

    deletePlayerModal.classList.add("hidden");
    deletePlayerModal.classList.remove("flex");
});



const confirmDeletePlayerButton = document.querySelector("#confirm-delete-player");

confirmDeletePlayerButton.addEventListener("click", function () {
    if (playerToDeleteId === null) return;

    const players = getPlayers();

    const playerToDelete = players.find(function (player) {
        return player.id === playerToDeleteId;
    });

    if (!playerToDelete) return;

    const history = getHistory();

    history.forEach(function (partie) {
        if (partie.playerId === playerToDeleteId || (!partie.playerId && partie.playerName === playerToDelete.nickname)) {
            partie.playerName = "Joueur supprimé";
        }
    });

    saveHistory(history);

    const remainingPlayers = players.filter(function (player) {
        return player.id !== playerToDeleteId;
    });

    savePlayers(remainingPlayers);

    if (localStorage.getItem("ece_active_player") === playerToDeleteId) {
        localStorage.removeItem("ece_active_player");
    }

    playerToDeleteId = null;

    deletePlayerModal.classList.add("hidden");
    deletePlayerModal.classList.remove("flex");

    renderPlayers();
});