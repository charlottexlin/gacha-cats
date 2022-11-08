// Code for the battles will go in here
// import this into app.mjs
import Chance from 'chance';

// instantiate chance
const chance = new Chance();

// whenever the player clicks the attack button...
// attack calculation helper method
// calculate attack by the cat
// calculate attack by the opponent
// update the stats of both the cat and the opponent
// do i need some more classes to do this???
// then render the page with updated stats

// Return the damage a fighter does, damage is random and scaled off the fighter's power level
function calculateAttack(powerLevel) {
    const crit = chance.weighted([true, false], [0.9, 0.1]); // TODO should the fighters have crit rates!?!?!
    // critical hit
    if (crit === true) { // TODO maybe show some display

    } else {
        return powerLevel * chance.floating({ min: 1.7, max: 1.3, fixed: 2 }); // TODO rework this cuz it has to be an integer
    }
}