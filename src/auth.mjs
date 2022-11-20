import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';

export const passwordStrength = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false
};

export const specialChars = "~'`!@#$%^&*()+={}[]|\\/:;\"<>?,";

const Player = mongoose.model('Player');

passport.use(new LocalStrategy(Player.authenticate()));

// make Passport persist information in the login session
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());