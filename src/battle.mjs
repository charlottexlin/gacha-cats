import Chance from 'chance';

// Instantiate chance
const chance = new Chance();

// Create an opponent object
export function createOpponent(opponentProfile) {
    return {fighterProfile: opponentProfile, currentHP: opponentProfile.maxHP};
}

// Runs one round of a battle between the two given fighters (NOT profiles)
export function battleRound(cat, opponent) {
    let continueBattle = true;
    let winner = '';

    // Cat attacks opponent
    const catAtk = calculateAttack(cat.fighterProfile.critRate, cat.fighterProfile.powerLevel);
    opponent.currentHP -= catAtk.atk;
    // Opponent attacks cat
    const oppAtk = calculateAttack(opponent.fighterProfile.critRate, opponent.fighterProfile.powerLevel);
    cat.currentHP -= oppAtk.atk;

    // Battle ends either one runs out of HP
    if (opponent.currentHP <= 0) {
        opponent.currentHP = 0;
        winner = 'cat';
        continueBattle = false;
    }
    if (cat.currentHP <= 0) {
        cat.currentHP = 0;
        winner = 'opponent';
        continueBattle = false;
    }
    
    return {
        continueBattle: continueBattle,
        winner: winner,
        catAtk: catAtk.atk, 
        oppAtk: oppAtk.atk,
        catCrit: catAtk.crit,
        oppCrit: oppAtk.crit
    }
}

// Return the damage a fighter does, damage is random and scaled off the fighter's power level
function calculateAttack(critRate, powerLevel) {
    const isCrit = chance.weighted([true, false], [critRate, 1-critRate]);
    // critical hit - attack is double the power level
    if (isCrit === true) {
        return {atk: Math.round(powerLevel * 2), crit: true};
    } else {
        return {atk: Math.round(powerLevel * chance.floating({ min: 0.8, max: 1.4})), crit: false};
    }
}