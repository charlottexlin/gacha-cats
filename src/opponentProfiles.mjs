// profiles for opponents
import Chance from 'chance';
import {FighterProfile} from './fighterProfile.mjs';

// Instantiate chance
const chance = new Chance();

const opponents = [
    // common opponents TODO
    new FighterProfile("Mr Test", "Evil evil", "opponent", "/img/test.png", 10, 4, 0.1, "common", 1),
];

// Get an opponent based on its name
export function getOpponent(name) {
    let match = {};
    opponents.forEach((opponent) => {
        if (opponent.defaultName === name) {
            match = opponent;
        }
    });
    return match;
}

// Get a random opponent
export function getRandomOpponent() {
    return chance.pickone(opponents);
}