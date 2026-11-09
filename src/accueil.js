import { getPlayers } from "./storage.js";
import { updateActivePlayerName, initMobileMenu } from "./ui.js";

const players = getPlayers();

updateActivePlayerName(players);
initMobileMenu();