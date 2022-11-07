import Chance from 'chance';
import {cats} from './catProfiles.mjs';

// instantiate chance
const chance = new Chance();

// using HOF (map) to get an array of the weights from the cats array
const probabilities = cats.map(cat => cat.rollProbability);

// function to return a randomly selected catProfile object, based on their roll probabilities
export function gachaRoll() {
    return chance.weighted(cats, probabilities);
}