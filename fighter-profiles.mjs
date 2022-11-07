import './db.mjs';

// Save all the fighter profile documents (the user is not allowed to change these)
// TODO these are supposed to be "preloaded" into the database - initial data, not sure if this makes sense
const gingerCat = new FighterProfile({
    defaultName: "Ginger", // name of this character
    subtitle: "",
    image: {}, // ___TODO__: I want to figure out how to get this to grab an image from the project directory
    maxHP: 50, // max HP of this fighter
    powerLevel: 5, // number to scale damage off of
    rarity: "common", // user-readable name for roll probability (i.e. common, uncommon, rare, or legendary)
    rollProbability: 0.10 // probability either to receive cat in gacha, or opponent in battle
});
gingerCat.save((err) => {
    if (err) {
        throw err;
    }
});

// TODO add the rest of the cats.

// Work in progress...
const catProfiles = [];

const opponentProfiles = [];