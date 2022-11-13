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

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mongoose schemas
const Player = mongoose.model('Player');
const Cat = mongoose.model('Cat');

// globals (TODO?)
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

// set up session support [REFERENCE: memorystore documentation https://www.npmjs.com/package/memorystore]
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
    res.render('register');
});

// register a new player [REFERENCE: Professor Versoza's slides on Passport.js https://cs.nyu.edu/courses/fall22/CSCI-UA.0467-001/_site/slides/16/auth.html#/ and Passport.js documentation https://www.passportjs.org/docs/]
app.post('/register', (req, res, next) => {
    // create a new player in the database
    Player.register(new Player({
        username: req.body.username,
        winStreak: 0,
        coins: 1000, // TODO temporary for testing
        fish: 0,
        playerLevel: 1,
        cats: [],
        currentOpponent: getOpponent('Mr Test') // TODO temporary for testing
    }), req.body.password, (err, player) => {
        if (err) {
            console.log("ERROR", err);
            res.render('register', {message: 'Error registering'}); // render an error on the register page TODO make error message more specific (e.g. username already taken)
        } else {
            passport.authenticate('local', {
                successRedirect: '/collection', // redirect to collection page if registration is successful
                failureRedirect: '/register', // redirect back to register page if unsuccessful
            })(req, res, next);
        }
    });
});

// login page, where returning players can log into an existing account
app.get('/login', (req, res) => {
    res.render('login');
});

// allow player to log into an existing account
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, player) => {
        if (player) {
            req.logIn(player, (err) => {
                if (!err) {
                    res.redirect('/collection');
                }
            });
        } else {
            res.render('login', {message: 'Account not found'});
        }
    })(req, res, next);
});

// collection page, where players can view the cats they currently have
app.get('/collection', (req, res) => {
    // get the documents for each of this player's cats
    Cat.find({'_id': {$in: req.user.cats}}, (err, docs) => {
        if (err) {
            throw err;
        }
        res.render('collection', {cats: docs});
    });
});

// battle start page, where players can set up a battle
app.get('/battle', (req, res) => {
    // create opponent
    currentOpponent = createOpponent(req.user.currentOpponent);

    // get the documents for each of this player's cats
    Cat.find({'_id': {$in: req.user.cats}}, (err, docs) => {
        if (err) {
            throw err;
        }
        res.render('battle', {opponent: currentOpponent, cats: docs});
    });
});

// player chooses which cat to use
app.post('/battle', (req, res) => {
    Cat.findOne({name: req.body.chosenCat}, (err, cat) => {
        if (err) {
            throw err;
        }
        chosenCat = cat;
        res.redirect('/battle/fight');
    });
    battleRounds = 0;
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
    res.render('gacha', {coins: req.user.coins});
});

// gacha roll page, where players can see what cat they rolled
app.get('/gacha/roll', (req, res) => {
    req.user.coins -= 10; // costs 10 coins to roll TODO make sure the player has enough coins left, otherwise show a message
    rolledCat = getGachaRoll(); // calculate the cat the player rolled
    Cat.findOne({player: req.user._id, fighterProfile: rolledCat}, (err, doc) => { // check if the player already has this cat
        let haveCat = false;
        if (err) {
            throw err;
        }
        if (doc) {
            haveCat = true;
            req.user.coins += 5; // convert cat to 5 coins instead TODO possible bug with coin count
        }
        req.user.save((err) => {
            if (err) {
                throw err;
            }
            res.render('gacha-roll', {coins: req.user.coins, rolledCat: rolledCat, haveCat: haveCat}); // render page with the cat the player rolled
        });
    });
});

// post to gacha roll page, where players can name a new cat they just rolled
// TODO what if the player navigates away before hitting submit??? should they still get the cat in their collection??
app.post('/gacha/roll', (req, res) => {
    const newCat = new Cat({
        player: req.user._id,
        name: req.body.name,
        fighterProfile: rolledCat,
        currentHP: rolledCat.maxHP,
        battlesWon: 0
    });
    newCat.save((err) => {
        if (err) {
            throw err;
        }
        req.user.cats.push(newCat._id);
        req.user.save((err) => {
            if (err) {
                throw err;
            }
            res.redirect('/gacha');
        });
    });
}); 

app.listen(process.env.PORT || 3000);