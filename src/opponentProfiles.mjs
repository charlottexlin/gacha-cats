// profiles for opponents
import {FighterProfile} from './fighterProfile.mjs';

const opponents = [
    // common opponents TODO
    new FighterProfile("Mr Test", "Evil evil", "opponent", "/img/test.png", 10, 4, 0.1, "common", 1),
];

export function getOpponent(name) {
    let match = {};
    opponents.forEach((opponent) => {
        if (opponent.defaultName === name) {
            match = opponent;
        }
    });
    return match;
}