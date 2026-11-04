
// update name player

export function updateActivePlayerName(players) {

    const activePlayerId = localStorage.getItem("ece_active_player");

    const activePlayer = players.find(function (namePlayer) {
        return namePlayer.id === activePlayerId;
    });

    const activePlayerNames = document.querySelectorAll(".active-player-name");

    activePlayerNames.forEach(function (element) {
        if (activePlayer) {
            element.textContent = activePlayer.nickname;
        } else {
            element.textContent = "Aucun";
        }

    })

}