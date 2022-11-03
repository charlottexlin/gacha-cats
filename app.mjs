import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import './db.mjs';
import './auth.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mongoose schemas
const Player = mongoose.model('Player');

// use handlebars
app.set("view engine", "hbs");

// set up session support
app.use(session({
    secret: 'the big secret (to save somewhere else)',
    resave: true,
    saveUninitialized: true,
}));

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to make player data available to all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file serving middleware
app.use(express.static(path.join(__dirname, "public")));

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
    Player.register(new Player({
        username: req.body.username,
        currentScore: 0,
        coins: 0,
        fish: 0,
        playerLevel: 1,
        cats: []
    }), req.body.password, (err, newPlayer) => {
        if (err) {
            res.render('register', {message: 'ERROR!!!!!!'});
        } else {
            passport.authenticate('local', {
                successRedirect: '/collection',
                failureRedirect: '/register',
            })(req, res, next);
        }
    });
});

// login page, where returning players can log into an existing account
app.get('/login', (req, res) => {
    res.send("login");
});

// collection page, where players can view the cats they currently have
app.get('/collection', (req, res) => {
    res.send("collection page");
});

// battle start page, where players can set up a battle
app.get('/battle/start', (req, res) => {
    res.send("battle start");
});

// TODO a couple other pages to be implemented

// gacha page, where players can roll on the gacha
app.get('/gacha', (req, res) => {
    res.send("gacha page");
});

app.listen(process.env.PORT || 3000);