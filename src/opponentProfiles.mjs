// profiles for opponents
import Chance from 'chance';
import {FighterProfile, commonPercentage, uncommonPercentage, rarePercentage, legendaryPercentage} from './fighterProfile.mjs';

// Instantiate chance
const chance = new Chance();

const opponents = [
    // common opponents
    new FighterProfile("Cheesy", "Little guy who loves cheese", "opponent", "/img/opponents/cheesy.png", 10, 4, 0, "common", commonPercentage),
    new FighterProfile("Toast", "Here to steal your cat treats", "opponent", "/img/opponents/toast.png", 10, 4, 0, "common", commonPercentage),
    new FighterProfile("#10347", "Escaped from the lab", "opponent", "/img/opponents/10347.png", 10, 4, 0, "common", commonPercentage),
    new FighterProfile("Elvis", "Sardonic singer", "opponent", "/img/opponents/elvis.png", 15, 5, 0.01, "common", commonPercentage),
    new FighterProfile("Pete", "Sailed the seven seas", "opponent", "/img/opponents/pete.png", 15, 5, 0.01, "common", commonPercentage),
    new FighterProfile("Muddy", "The horrible hopper", "opponent", "/img/opponents/muddy.png", 15, 5, 0.02, "common", commonPercentage),
    new FighterProfile("Coco", "Cat-hating chihuahua", "opponent", "/img/opponents/coco.png", 20, 5, 0.02, "common", commonPercentage),
    // uncommon opponents
    new FighterProfile("Merlin", "Wise warrior", "opponent", "/img/opponents/merlin.png", 20, 7, 0.03, "uncommon", uncommonPercentage),
    new FighterProfile("New York Nick", "He's walkin' here!", "opponent", "/img/opponents/newyorknick.png", 20, 7, 0.03, "uncommon", uncommonPercentage),
    new FighterProfile("Genji", "Merciless magpie", "opponent", "/img/opponents/genji.png", 20, 8, 0.04, "uncommon", uncommonPercentage),
    new FighterProfile("Boris", "Bloodthirsty battler", "opponent", "/img/opponents/boris.png", 25, 8, 0.04, "uncommon", uncommonPercentage),
    new FighterProfile("Big Mac", "Ruthless raccoon", "opponent", "/img/opponents/bigmac.png", 25, 8, 0.04, "uncommon", uncommonPercentage),
    // rare opponents
    new FighterProfile("Persimmon", "Battle bear", "opponent", "/img/opponents/persimmon.png", 30, 10, 0.05, "rare", rarePercentage),
    new FighterProfile("Kit", "Sneaky fox", "opponent", "/img/opponents/kit.png", 50, 9, 0.06, "rare", rarePercentage),
    // legendary opponents
    new FighterProfile("Draco", "Thieving jewel hoarder", "opponent", "/img/opponents/draco.png", 70, 15, 0.08, "legendary", legendaryPercentage),
    new FighterProfile("Void", "???", "opponent", "/img/opponents/void.png", 70, 20, 0.11, "legendary", legendaryPercentage),
];

// Get an opponent profile based on its name
export function getOpponent(name) {
    let match = {};
    opponents.forEach((opponent) => {
        if (opponent.defaultName === name) {
            match = opponent;
        }
    });
    return match;
}

// Get a random opponent
export function getRandomOpponent() {
    return chance.pickone(opponents);
}