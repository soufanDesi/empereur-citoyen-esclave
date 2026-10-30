import { getPlayers, savePlayers } from "./storage.js";

export function addPlayer(nickname, avatar) {
    const players = getPlayers();

    // tcheck name
    const regexNickName = /^[A-Za-z0-9]{3,15}$/;

    // Vérifier le pseudo
    if (!regexNickName.test(nickname)) {
        return { error: "Pseudo invalide : 3 à 15 lettres ou chiffres." };
    }

    //Vérifier si le pseudo existe déjà
    const isDuplicate = players.some(function (player) {
        return player.nickname.toLowerCase() === nickname.toLowerCase();
    });

    if (isDuplicate) {
        return { error: "Ce pseudo est déjà utilisé." };
    }

    //Vérifier l'avatar
    const allowedAvatars = [
        "arab-man_945277.png",
        "athlete_945279.png",
        "dancer_945275.png",
        "devil_945280.png",
        "stewardess_945227.png",
        "woman_945276.png"
    ];

    if (!allowedAvatars.includes(avatar)) {
        return { error: "Veuillez choisir un avatar valide." };
    }

    // Créer le joueur
    const newPlayer = {
        id: "p_" + Date.now(),
        nickname: nickname,
        avatar: avatar,
        createdAt: new Date().toISOString().split("T")[0]
    };

    // Ajouter et sauvegarder
    players.push(newPlayer);
    savePlayers(players);

    // Retourner le joueur
    return newPlayer;
}