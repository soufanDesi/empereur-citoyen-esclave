import { getPlayers } from "./storage.js";
import { updateActivePlayerName } from "./ui.js";

const players = getPlayers();

updateActivePlayerName(players);



