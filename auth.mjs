import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const Player = mongoose.model('Player');

passport.use(new LocalStrategy(Player.authenticate()));

// make Passport persist information in the login session
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());