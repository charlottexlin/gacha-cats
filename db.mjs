import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

// players, who each must register with a username and password to play the game, and can login to their accounts
const PlayerSchema = new mongoose.Schema({
    // username - using passport
    // password hash - using passport
    currentScore: {type: Number, min: 0, required: true}, // how many battles this player has won in a row, without losing
    coins: {type: Number, min: 0, required: true}, // in-game currency used for gacha
    fish: {type: Number, min: 0, required: true}, // in-game currency used for restoring Cat HP
    playerLevel: {type: Number, min: 1, required: true}, // (total # of battles won) / 10
    cats:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cat' }] // array of references to Cats documents; represents the Cats a player has
});

// authentication for player login
PlayerSchema.plugin(passportLocalMongoose);

// cats, which belong to players. Players may have multiple cats, but only one of each with the same FighterProfile.
const CatSchema = new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}, // a reference to the Player to which this Cat belongs
    fighterProfile: {type: mongoose.Schema.Types.ObjectId, ref:'FighterProfile'}, // a reference to a FighterProfile document, which holds the immutable properties of this Cat
    currentHP: {type: Number, min: 0, required: true}, // increases if a fish is used on this Cat, decreases in battle
    battlesWon: {type: Number, min: 0, required: true} // how many battles this Cat has won
});

// fighter profiles, which store unchangeable data related to a specific cat or opponent
const FighterProfileSchema = new mongoose.Schema({
    defaultName: {type: String, required: true}, // default name of this fighter
    subtitle: {type: String, required: true}, // text to be displayed with the fighter's name
    image: { data: Buffer, contentType: String }, // image to display to represent this fighter
    maxHP: {type: Number, min: 0, required: true}, // max HP of this fighter
    powerLevel: {type: Number, min: 0, required: true}, // number to scale damage off of
    rarity: {type: String, required: true, enum: ["common", "uncommon", "rare", "legendary"]}, // user-readable name for roll probability
    rollProbability: {type: Number, min: 0, required: true} // probability either to receive cat in gacha, or opponent in battle
});

// Register models
const Player = mongoose.model('Player', PlayerSchema);
const Cat = mongoose.model('Cat', CatSchema);
const FighterProfile = mongoose.model('FighterProfile', FighterProfileSchema);

mongoose.connect('mongodb://localhost/final-project');