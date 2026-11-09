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


export function saveCurrentGame(game) {
    localStorage.setItem("ece_current_game", JSON.stringify(game));
}

export function getCurrentGame() {
    const data = localStorage.getItem("ece_current_game");

    if (data) {
        return JSON.parse(data);
    }

    return null;
}


export function getHistory() {
    const data = localStorage.getItem("ece_history");

    if (data) {
        return JSON.parse(data);
    }
    return [];
}

export function saveHistory(history) {
    localStorage.setItem("ece_history", JSON.stringify(history));
}