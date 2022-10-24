// 1ST DRAFT DATA MODEL
import mongoose from "mongoose";

// players, who each must register with a username and password to play the game, and can login to their accounts
const PlayerSchema = new mongoose.Schema({
    // username - using passport.js for authentication
    // password hash - using passport.js for authentication
    currentScore: {type: Number, min: 0, required: true}, // how many battles this player has won in a row, without losing
    coins: {type: Number, min: 0, required: true}, // in-game currency used for gacha
    heartCapsules: {type: Number, min: 0, required: true}, // in-game currency used for restoring Fighter HP
    playerLevel: {type: Number, min: 1, required: true}, // (total # of battles won) / 10
    fighters:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fighter' }] // array of references to Fighter documents; represents the Fighters a player has
});

// fighters, which belong to players. Players may have multiple fighters, but only one of each with the same characterProfile.
const FighterSchema = new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref:'Player'}, // a reference to the Player to which this Fighter belongs
    characterProfile: {type: mongoose.Schema.Types.ObjectId, ref:'CharacterProfile'}, // a reference to a CharacterProfile document, which holds the immutable properties of this Fighter
    currentHP: {type: Number, min: 0, required: true}, // increases if a heart capsule is used on this Fighter, decreases in battle
    battlesWon: {type: Number, min: 0, required: true} // how many battles this fighter has won
});

// character profiles, which store unchangeable data related to a specific fighter or opponent
const CharacterProfileSchema = new mongoose.Schema({
    name: {type: String, required: true}, // name of this character
    image: { data: Buffer, contentType: String }, // image to display to represent this character
    maxHP: {type: Number, min: 0, required: true}, // max HP of this character
    powerLevel: {type: Number, min: 0, required: true}, // number to scale damage off of
    rarity: {type: String, required: true}, // user-readable name for roll probability (i.e. common, uncommon, rare, or legendary)
    rollProbability: {type: Number, min: 0, required: true} // probability either to receive fighter in gacha, or opponent in battle
});

// Register models
const Player = mongoose.model('Player', PlayerSchema);
const Fighter = mongoose.model('Fighter', FighterSchema);
const CharacterProfile = mongoose.model('CharacterProfile', CharacterProfileSchema);

// First save all the character profile documents, since these will not be changed within the app (the user is not allowed to changes these)
// One as an example
const fighter1 = new CharacterProfile({
    name: "Mrs. Fighter1", // name of this character
    image: {}, // ___TODO__: I want to figure out how to get this to grab an image from the project directory
    maxHP: 50, // max HP of this character
    powerLevel: 5, // number to scale damage off of
    rarity: "common", // user-readable name for roll probability (i.e. common, uncommon, rare, or legendary)
    rollProbability: 0.10 // probability either to receive fighter in gacha, or opponent in battle
});
fighter1.save((err) => {
    if (err) {
        throw err;
    };
});

// __TODO__: CharacterProfile.insertMany - can think about the most organized way to save all these documents

// mongoose.connect