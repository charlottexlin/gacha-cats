import '../opponentProfiles.mjs';

// Run main function only when the battle page has finished loading
document.addEventListener('DOMContentLoaded', main);

// Main function
function main() {
    // listen for click on the start form's submit button
    const startBtn = document.querySelector('input[type="submit"]');
    startBtn.addEventListener('click', function() {
        // Don't let Submit button make POST request
        this.preventDefault();
        // Make the start form invisible
        const startForm = document.getElementById('startBattleForm');
        startForm.classList.toggle('invisible');
        // Get the chosen cat from the form
        const chosenCat = document.querySelector('input[type="select"]').value;
        // Make the cat and opponent visible TODO
        const catInfo = document.getElementById('catInfo');
        catInfo.textContent = chosenCat.name + ' - HP: ' + chosenCat.currentHP; // TODO
        // Make the attack button visible TODO
        const opponentName = document.getElementById('opponentName');
        const opponent = createOpponent(getOpponent(opponentName));
        const opponentInfo = document.getElementById('opponentInfo');
        opponentInfo.textContent = opponent.fighterProfile.defaultName + ' - HP: ' + opponent.currentHP; // TODO
        // attack button add event listener
        const attackBtn = document.getElementById('attackBtn');
        attackBtn.addEventListener('click', function() { battleRound(chosenCat, opponent) } );
    });
}

// Create an opponent object
function createOpponent(opponentProfile) {
    return {fighterProfile: opponentProfile, currentHP: opponentProfile.maxHP};
}

// Runs one round of a battle between the two given fighters (NOT profiles)
function battleRound(cat, opponent) { // TODO add front end stuff
    // Cat attacks opponent
    opponent.currentHP -= calculateAttack(cat.fighterProfile.critRate, cat.fighterProfile.powerLevel); // TODO some display
    // Opponent attacks cat
    cat.currentHP -= calculateAttack(opponent.fighterProfile.critRate, opponent.fighterProfile.powerLevel);

    // Update text
    const catInfo = document.getElementById('catInfo');
    catInfo.textContent = chosenCat.name + ' - HP: ' + chosenCat.currentHP; // TODO
    const opponentInfo = document.getElementById('opponentInfo');
    opponentInfo.textContent = opponent.fighterProfile.defaultName + ' - HP: ' + opponent.currentHP; // TODO
}