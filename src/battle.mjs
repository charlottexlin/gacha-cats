import Chance from 'chance';

// Instantiate chance
const chance = new Chance();

// Create an opponent object
export function createOpponent(opponentProfile) {
    return {fighterProfile: opponentProfile, currentHP: opponentProfile.maxHP};
}

// Runs one round of a battle between the two given fighters (NOT profiles)
export function battleRound(cat, opponent) { // TODO add front end stuff
    let continueBattle = true;
    let winner = '';

    // Cat attacks opponent
    opponent.currentHP -= calculateAttack(cat.fighterProfile.critRate, cat.fighterProfile.powerLevel); // TODO some display
    // Opponent attacks cat
    cat.currentHP -= calculateAttack(opponent.fighterProfile.critRate, opponent.fighterProfile.powerLevel);

    // Battle ends either one runs out of HP
    if (opponent.currentHP <= 0) {
        opponent.currentHP = 0;
        winner = 'cat';
        continueBattle = false;
    }
    else if (cat.currentHP <= 0) {
        cat.currentHP = 0;
        winner = 'opponent';
        continueBattle = false;
    }
    
    return {continueBattle: continueBattle, winner: winner}
}

// Return the damage a fighter does, damage is random and scaled off the fighter's power level
function calculateAttack(critRate, powerLevel) {
    const isCrit = chance.weighted([true, false], [critRate, 1-critRate]);
    // critical hit - attack is double the power level
    if (isCrit === true) { // TODO maybe show some display
        console.log('CRIT ATTACK'); // TODO
        return Math.round(powerLevel * 2);
    } else {
        return Math.round(powerLevel * chance.floating({ min: 0.8, max: 1.4}));
    }
}