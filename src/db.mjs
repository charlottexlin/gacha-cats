import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

// players, who each must register with a username and password to play the game, and can login to their accounts
const PlayerSchema = new mongoose.Schema({
    username: {type: String, required: true}, // username
    winStreak: {type: Number, min: 0, required: true}, // how many battles this player has won in a row, without losing
    coins: {type: Number, min: 0, required: true}, // in-game currency used for gacha
    fish: {type: Number, min: 0, required: true}, // in-game currency used for restoring Cat HP
    playerLevel: {type: Number, min: 1, required: true}, // (total # of battles won) / 10
    cats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cat' }] // array of references to Cats documents; represents the Cats a player has
});

// authentication for player login
PlayerSchema.plugin(passportLocalMongoose);

// cats, which belong to players. Players may have multiple cats, but only one of each with the same FighterProfile.
const CatSchema = new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}, // a reference to the Player to which this Cat belongs
    name: {type: String, required: true}, // name that the player chose for this cat
    fighterProfile: {type: Object, required: true}, // a reference to a FighterProfile object, which holds the immutable properties of this cat
    currentHP: {type: Number, min: 0, required: true}, // increases if a fish is used on this Cat, decreases in battle
    battlesWon: {type: Number, min: 0, required: true} // how many battles this Cat has won
});

// Register models
const Player = mongoose.model('Player', PlayerSchema);
const Cat = mongoose.model('Cat', CatSchema);

mongoose.connect('mongodb+srv://cxl229:TemporaryPassword1107@cluster0.6kfmsf3.mongodb.net/?retryWrites=true&w=majority');