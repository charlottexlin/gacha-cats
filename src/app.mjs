import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import memoryStore from 'memorystore';
import passport from 'passport';
import mongoose from 'mongoose';
import './db.mjs';
import './auth.mjs';
import {getGachaRoll} from './gacha.mjs';
import {getOpponent, getRandomOpponent} from './opponentProfiles.mjs';
import {battleRound, createOpponent} from './battle.mjs';
import { cats } from './catProfiles.mjs';

// ---------- APP SET UP AND MIDDLEWARE REGISTRATION ----------
// set up express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mongoose schemas
const Player = mongoose.model('Player');
const Cat = mongoose.model('Cat');

// globals
const specialChars = "~'`!@#$%^&*()+={}[]|\\/:;\"<>?,";
let rolledCat = {};
let chosenCat = {};
let currentOpponent = {};
let battleRounds = 0;

// use handlebars
app.set("view engine", "hbs");

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// set up session support
// REFERENCE: memorystore documentation [https://www.npmjs.com/package/memorystore]
const Store = memoryStore(session);
app.use(session({
    cookie: { maxAge: 86400000 },
    secret: 'the big secret',
    resave: false,
    saveUninitialized: false,
    store: new Store({
        checkPeriod: 86400000 // expired entries will be cleaned up every 24 hours
    })
}));

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to make player data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// ---------- ROUTING ----------
// homepage, where not-logged-in players can either log in or register (logged-in players will be redirected to the collection page)
app.get('/', (req, res) => {
    if (!req.user) {
        res.render('index');
    } else {
        res.redirect('/collection');
    }
});

// registration page, where new players can make an account
app.get('/register', (req, res) => {
    res.render('login', {pageName: 'Register', action: 'register'});
});

// register a new player
// REFERENCE: Professor Versoza's slides on Passport.js [https://cs.nyu.edu/courses/fall22/CSCI-UA.0467-001/_site/slides/16/auth.html#/]
// REFERENCE: Passport.js documentation [https://www.passportjs.org/docs/]
app.post('/register', (req, res, next) => {
    // ensure that username is between 5 - 20 characters and contains no special characters, and that password is 8 or more characters
    const username = req.body.username.trim();
    if (username.length < 5) {
        res.render('login', {errorMsg: 'Username must be at least 5 characters long.', pageName:'Register', action: 'register'});
    } else if (username.length > 20) {
        res.render('login', {errorMsg: 'Username can not be longer than 20 characters.', pageName:'Register', action: 'register'});
    } else if (username.includes(' ') || [...specialChars].some(char => username.includes(char))) { // use of HOF some
        res.render('login', {errorMsg: "Username can not include spaces or characters ~'`!@#$%^&*()+={}[]|\\/:;\"<>?,", pageName: 'Register', action: 'register'});
    } else if (req.body.password.length < 8) {
        res.render('login', {errorMsg: 'Password must be at least 8 characters long.', pageName: 'Register', action: 'register'});
    } else {
        // if everything's good, create a new player with blank stats in the database
        Player.register(new Player({
            username: username,
            winStreak: 0,
            coins: 1000, // TODO temporary for testing
            fish: 0,
            playerLevel: 1,
            battleCounter: 0,
            cats: [],
            currentOpponent: getOpponent('Cheesy'), // All new players start by facing off with Cheesy
        }), req.body.password, (err) => {
            if (err) { // Error registering player
                res.render('login', {errorMsg: 'This username is already in use.', pageName: 'Register', action: 'register'});
            } else { // Success registering player
                passport.authenticate('local', {
                    successRedirect: '/collection', // redirect to collection page if registration is successful
                    failureRedirect: '/register', // redirect back to register page if unsuccessful
                })(req, res, next);
            }
        });
    }
});

// login page, where returning players can log into an existing account
app.get('/login', (req, res) => {
    res.render('login', {pageName: 'Login', action: 'login'});
});

// allow player to log into an existing account
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, player) => {
        if (err) { // Error authenticating
            res.render('login', {errorMsg: 'Log in failed. Please try again.', pageName: 'Login', action: 'login'});
        }
        if (player) { // Successfully authenticated player, now log them in
            req.logIn(player, (err) => {
                if (!err) {
                    res.redirect('/collection');
                }
            });
        } else { // Account not found
            res.render('login', {errorMsg: 'Account not found - did you enter the wrong username or password?', pageName: 'Login', action: 'login'});
        }
    })(req, res, next);
});

// allow player to log out of currently logged-in account
// REFERENCE: passport JS documentation [https://www.passportjs.org/concepts/authentication/logout/]
app.post('/logout', function(req, res){
    req.logout((err) => {
        if (err) {
            res.send('Error logging out');
        }
        res.redirect('/');
    });
});

// collection page, where logged-in players can view the cats they currently have
app.get('/collection', (req, res) => {
    // redirect to homepage if not logged in
    if (!req.user) {
        res.redirect('/');
    } else {
        // get the documents for each of this player's cats
        Cat.find({'_id': {$in: req.user.cats}}, (err, docs) => {
            if (err) {
                res.render('collection', {errorMsg: 'Error displaying cats'});
            }
            // show collection page that lists all the player's cats
            if (docs.length === 0) {
                res.render('collection', {noCats: true, cats: docs});
            } else {
                res.render('collection', {noCats: false, cats: docs});
            }
        });
    }
});

// battle start page, where players can set up a battle
app.get('/battle', (req, res) => {
    // redirect to homepage if not logged in
    if (!req.user) {
        res.redirect('/');
    } else {
        // create opponent
        currentOpponent = createOpponent(req.user.currentOpponent);

        // get the documents for each of this player's cats
        Cat.find({'_id': {$in: req.user.cats}}, (err, docs) => {
            if (err) {
                res.render('battle', {errorMsg: 'Error getting your cats'});
            }
            // show battle set-up page with dropdown options for all the player's cats
            if (docs.length === 0) {
                res.render('battle', {opponent: currentOpponent, noCats: true, cats: docs});
            } else {
                res.render('battle', {opponent: currentOpponent, noCats: false, cats: docs});
            }
        });
    }
});

// player chooses which cat to use for the battle
app.post('/battle', (req, res) => {
    Cat.findOne({name: req.body.chosenCat}, (err, cat) => {
        if (err) {
            res.render('battle', {errorMsg: 'Error finding your chosen cat'});
        }
        // Can not use a cat in battle if they are at 0 HP
        if (cat.currentHP <= 0) {
            res.render('battle', {errorMsg: cat.name + " is at 0 HP and can not battle. Restore their HP by feeding them fish on the collection page.", opponent: currentOpponent, noCats: false, cats: docs});
        } else {
            chosenCat = cat;
            battleRounds = 0;
            res.redirect('/battle/fight');
        }
    });
})

// battle fight page, where players can fight an opponent
app.get('/battle/fight', (req, res) => { // TODO this should maybe not be a "gettable" route. will update
    // first round of battle
    if (battleRounds === 0) {
        res.render('battle-fight', {opponent: currentOpponent, cat: chosenCat});
        battleRounds++;
    }
    // subsequent rounds
    else {
        // battle is ongoing
        battleRounds++;
        const roundResults = battleRound(chosenCat, currentOpponent);
        if (roundResults.continueBattle) {
            res.render('battle-fight', {opponent: currentOpponent, cat: chosenCat});
        }
        // battle has ended, we have a winner
        else {
            battleEnd(req, res, roundResults.winner);
        }
    }
});

// helper function that does all necessary updates after a battle ends
async function battleEnd(req, res, winner) {
    // update cat's current HP and battles won
    const cat = await Cat.findOne({name: chosenCat.name});
    cat.currentHP = chosenCat.currentHP;
    if (winner === 'cat') {
        cat.battlesWon++;
    }
    await cat.save();
    // player's cat won
    if (winner === 'cat') {
        // Give player coins and fish, amount is based on level of current opponent
        const opponentLevel = currentOpponent.fighterProfile.powerLevel;
        let fish = 0;
        let coins = 0;
        switch (opponentLevel) {
            case 4:
                coins = 10;
                fish = 4;
                break;
            case 5:
                coins = 15;
                fish = 7;
                break;
            case 7:
                coins = 20;
                fish = 12;
                break;
            case 8:
                coins = 25;
                fish = 15;
                break;
            case 9:
                coins = 30;
                fish = 18;
                break;
            case 10:
                coins = 35;
                fish = 22;
                break;
            case 20:
                coins = 100;
                fish = 50;
                break;
        }
        // update player's win streak
        req.user.winStreak++;
        // update player's battle counter, and possibly level
        if (req.user.battleCounter + 1 === 10) { // reached the next level
            req.user.playerLevel++; // TODO possibly show a message on level up??
            req.user.battleCounter = 0; // reset battle counter
        } else {
            req.user.battleCounter++;
        }
        // Get a new current opponent for the player
        const randomOpponent = getRandomOpponent();
        req.user.currentOpponent = randomOpponent;
        await req.user.save();
        // Set global
        currentOpponent = randomOpponent;
        // show win screen
        res.render('battle-win', {fish: fish, coins: coins});
    }
    // opponent won
    else if (winner === 'opponent') {
        // update player's win streak
        if (req.user.winStreak > 0) {
            req.user.winStreak = 0;
        }
        // show lose screen
        res.render('battle-lose');
    }
}

// gacha page, where players can roll on the gacha
app.get('/gacha', (req, res) => {
    // redirect to homepage if not logged in
    if (!req.user) {
        res.redirect('/');
    } else {
        res.render('gacha', {coins: req.user.coins});
    }
});

// gacha roll page, where players can see what cat they rolled
app.get('/gacha/roll', (req, res) => { // TODO also shoudln't be gettable
    // player doesn't have enough coins left
    if (req.user.coins < 10) {
        res.render('gacha', {errorMsg: "You don't have enough coins to roll. Battle to earn more coins!", coins: req.user.coins});
    } else {
        req.user.coins -= 10; // costs 10 coins to roll
        rolledCat = getGachaRoll(); // calculate the cat the player rolled
        Cat.findOne({player: req.user._id, fighterProfile: rolledCat}, (err, doc) => { // check if the player already has this cat
            let haveCat = false;
            if (err) {
                res.render('gacha', {errorMsg: 'Error checking if you already have this cat'});
            }
            if (doc) {
                haveCat = true;
                req.user.coins += 5; // if player already has this cat, convert it to 5 coins and 2 fish instead
                req.user.fish += 2;
            }
            req.user.save((err) => {
                if (err) {
                    res.render('gacha', {errorMsg: 'Error saving your coin and fish count'});
                }
                else {
                    res.render('gacha-roll', {coins: req.user.coins, rolledCat: rolledCat, haveCat: haveCat}); // render page with the cat the player rolled
                }
            });
        });
    }
});

// post to gacha roll page, where players can name a new cat they just rolled
app.post('/gacha/roll', (req, res) => {
    // ensure cat's name is not too long and doesn't have special characters
    const catName = req.body.name.trim();
    if (catName.length > 20) {
        res.render('gacha-roll', {errorMsg: 'Cat name can not be longer than 20 characters', coins: req.user.coins, rolledCat: rolledCat, haveCat: false});
    } else if ([...specialChars].some(char => catName.includes(char))) {
        res.render('gacha-roll', {errorMsg: "Cat name can not include characters ~'`!@#$%^&*()+={}[]|\\/:;\"<>?,", coins: req.user.coins, rolledCat: rolledCat, haveCat: false});
    } else {
        // ensure cat's name is not a duplicate name
        Cat.findOne({name: catName}, (err, doc) => {
            if (err) {
                res.render('gacha-roll', {errorMsg: "Error checking cat's name"});
            }
            // already have a cat by this name
            if (doc) {
                res.render('gacha-roll', {errorMsg: 'You already have a cat by that name'});
            } else { // all good
                // create the new cat for this player to have
                const newCat = new Cat({
                    player: req.user._id,
                    name: catName,
                    fighterProfile: rolledCat,
                    currentHP: rolledCat.maxHP,
                    battlesWon: 0
                });
                // save the cat into the database
                newCat.save((err) => {
                    if (err) {
                        res.render('gacha-roll', {errorMsg: 'Error saving the new cat'});
                    }
                    req.user.cats.push(newCat._id);
                    req.user.save((err) => {
                        if (err) {
                            res.render('gacha-roll', {errorMsg: "Error saving user's cat list"});
                        }
                        res.redirect('/gacha'); // on success, go back to gacha page
                    });
                });
            }
        });
    }
}); 

app.listen(process.env.PORT || 3000);