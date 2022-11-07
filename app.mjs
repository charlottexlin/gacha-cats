import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import './db.mjs';
import './auth.mjs';
import {getGachaRoll} from './gacha.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mongoose schemas
const Player = mongoose.model('Player');
const Cat = mongoose.model('Cat');

// global (TODO?)
let rolledCat = {};

// use handlebars
app.set("view engine", "hbs");

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file serving middleware
app.use(express.static(path.join(__dirname, "public")));

// set up session support
app.use(session({
    secret: 'the big secret (to save somewhere else)',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.authenticate('session')); // TODO

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to make player data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user; // TODO think this is having some issue
    next();
});

// ---------- ROUTING ----------
// homepage, where players can either log in or register
app.get('/', (req, res) => {
    res.render('index');
});

// registration page, where new players can make an account
app.get('/register', (req, res) => {
    res.render('register');
});

// register a new player
app.post('/register', (req, res, next) => {
    // create a new player in the database
    Player.register(new Player({
        username: req.body.username,
        currentScore: 0,
        coins: 1000, // TODO temporary for testing
        fish: 0,
        playerLevel: 1,
        cats: []
    }), req.body.password, (err, player) => {
        if (err) {
            console.log("ERROR", err);
            res.render('register', {message: 'ERROR!!!!!!'}); // render an error on the register page TODO make error message more specific
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
    res.render('battle');
});

// gacha page, where players can roll on the gacha
app.get('/gacha', (req, res) => {
    res.render('gacha', {coins: req.user.coins});
});

// gacha roll page, where players can see what cat they rolled
app.get('/gacha/roll', (req, res) => {
    req.user.coins -= 10; // costs 10 coins to roll
    rolledCat = getGachaRoll(); // calculate the cat the player rolled
    Cat.findOne({player: req.user._id, fighterProfile: rolledCat}, (err, doc) => {
        let haveCat = false;
        if (err) {
            throw err;
        }
        if (doc) {
            haveCat = true;
            req.user.coins += 5; // convert cat to 5 coins instead TODO bug with coin count if you roll again directly...
            req.user.save();
        }
        req.user.save();
        res.render('gacha', {coins: req.user.coins, rolledCat: rolledCat, haveCat: haveCat}); // render page with the cat the player rolled
    }); // check if the player already has this TODO does this query work properly?
});

// post to gacha roll page, where players can name a new cat they just rolled
// TODO what if the player navigates away before hitting submit??? should they still get the cat in their collection??
app.post('/gacha/roll', (req, res) => {
    const newCat = new Cat({
        player: req.user._id,
        name: req.body.name,
        fighterProfile: rolledCat, // TODO probably should find a better way to do this than using a global
        currentHP: rolledCat.maxHP,
        battlesWon: 0
    });
    newCat.save((err) => {
        if (err) {
            throw err;
        }
        res.redirect("/gacha");
    });
    req.user.cats.push(newCat._id);
    req.user.save(); // TODO lol if you click the roll button too many times in a row it gets overwhelmed
}); 

app.listen(process.env.PORT || 3000);