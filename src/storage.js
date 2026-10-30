export function savePlayers(players) {
    localStorage.setItem("ece_players", JSON.stringify(players));
}

export function getPlayers() {
    const data = localStorage.getItem("ece_players");
    if (data) {
        return JSON.parse(data);
    } else {
        return [];
    }
}