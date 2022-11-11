// profiles for opponents
import {FighterProfile} from './fighterProfile.mjs';
import Chance from 'chance';

// Instantiate chance
const chance = new Chance();

export const opponents = [
    // common opponents TODO
    new FighterProfile("Mr Test", "Evil evil", "opponent", "/img/test.png", 10, 4, 0.1, "common", 1)
]

export function getOpponent(name) {
    let match = {};
    opponents.forEach((opponent) => {
        if (opponent.name === name) {
            match = opponent;
            console.log("FOUND"); // TODO
        }
    });
    return match;
}

// Return the damage a fighter does, damage is random and scaled off the fighter's power level
export function calculateAttack(critRate, powerLevel) { // TODO will have to move this somewhere else...
    const isCrit = chance.weighted([true, false], [critRate, 1-critRate]);
    // critical hit - attack is double the power level
    if (isCrit === true) { // TODO maybe show some display
        console.log('CRIT ATTACK'); // TODO
        return Math.round(powerLevel * 2);
    } else {
        return Math.round(powerLevel * chance.floating({ min: 0.8, max: 1.4}));
    }
}