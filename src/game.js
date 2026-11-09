const cartesEmpereur = [
    "Citoyen",
    "Citoyen",
    "Citoyen",
    "Citoyen",
    "Empereur"
];

const cartesEsclave = [
    "Citoyen",
    "Citoyen",
    "Citoyen",
    "Citoyen",
    "Esclave"
];

export function createHand(camp) {
    if (camp === "Empereur") {
        return [...cartesEmpereur]
    } return [...cartesEsclave]
}

// card vs
export function duel(carteJoueur, carteOrdinateur) {
    if (carteJoueur === carteOrdinateur) {
        return "egalite"
    } else if ((
        (carteJoueur === "Empereur" && carteOrdinateur === "Citoyen") || (carteJoueur === "Citoyen" && carteOrdinateur === "Esclave") || (carteJoueur === "Esclave" && carteOrdinateur === "Empereur")
    )) {
        return "victoire";
    } else {
        return "defaite";
    }
}


export function chooseComputerCard(mainPC) {
    const randomIndex = Math.floor(Math.random() * mainPC.length);
    return mainPC[randomIndex]
}


export function removePlayedCard(hand, card) {
    const indexCard = hand.indexOf(card);
    if (indexCard !== -1) {
        hand.splice(indexCard, 1)
    }
}


export function getPlayerCamp(manche) {
    if (manche >= 1 && manche <= 3) {
        return "Empereur"
    } else if (manche >= 4 && manche <= 6) {
        return "Esclave"
    } else if (manche >= 7 && manche <= 9) {
        return "Empereur"
    } else if (manche >= 10 && manche <= 12) {
        return "Esclave"
    }
}


export function getComputerCamp(campJoueur) {
    if (campJoueur === "Empereur") {
        return "Esclave"
    }
    return "Empereur"
}


export function getPoints(camp) {
    if (camp === "Esclave") {
        return 5
    } else return 1
}


export function updateScore(resultat, campJoueur, campPC, scoreJoueur, scorePC) {
    if (resultat === "victoire") {
        scoreJoueur += getPoints(campJoueur);
    } else if (resultat === "defaite") {
        scorePC += getPoints(campPC);
    }

    return {
        scoreJoueur,
        scorePC
    }
}


export function nextRound(manche) {
    if (manche === 12) {
        return null;
    }

    return manche + 1;
}

export function switchFirstCamp(premierCamp) {
    if (premierCamp === "Empereur") {
        return "Esclave";
    }
    return "Empereur";
}