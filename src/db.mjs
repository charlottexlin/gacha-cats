import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';
import dotenv from "dotenv";

// configure environment variables
dotenv.config();

// players, who each must register with a username and password to play the game, and can login to their accounts
const PlayerSchema = new mongoose.Schema({
    username: {type: String, required: true}, // username
    winStreak: {type: Number, min: 0, required: true}, // how many battles this player has won in a row, without losing
    coins: {type: Number, min: 0, required: true}, // in-game currency used for gacha
    fish: {type: Number, min: 0, required: true}, // in-game currency used for restoring Cat HP
    playerLevel: {type: Number, min: 1, required: true}, // (total # of battles won) / 10
    battleCounter: {type: Number, min: 0, max: 10, required: true}, // number of battles this player has won since they last leveled up, used for setting player level
    cats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cat'}], // array of references to Cats documents; represents the Cats a player has
    currentOpponentProfile: {type: Object, required: true}, // a FighterProfile object that represents the current opponent this player is facing
    currentOpponent: {type: Object}, // an object that holds the current opponent's FighterProfile and its current HP, to be used in battle
    chosenCat: {type: mongoose.Schema.Types.ObjectId, ref: 'Cat'}, // a reference to a Cat document that represents the cat the player is currently using in battle
    battleRounds: {type: Number}, // what round of battle the player is currently on
    rolledCat: {type: Object} // a FighterProfile object that represents the cat a player just rolled on the gacha
});

// authentication for player login
PlayerSchema.plugin(passportLocalMongoose);

// cats, which belong to players. Players may have multiple cats, but only one of each with the same FighterProfile.
const CatSchema = new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}, // a reference to the Player to which this Cat belongs
    name: {type: String, required: true}, // name that the player chose for this cat
    fighterProfile: {type: Object, required: true}, // a FighterProfile object, which holds the immutable properties of this cat
    currentHP: {type: Number, required: true}, // increases if a fish is used on this Cat, decreases in battle
    battlesWon: {type: Number, min: 0, required: true} // how many battles this Cat has won in total
});

// Register models
const Player = mongoose.model('Player', PlayerSchema);
const Cat = mongoose.model('Cat', CatSchema);

mongoose.connect(process.env.DATABASE);