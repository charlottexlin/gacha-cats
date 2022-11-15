// profiles for cats
import {FighterProfile} from './fighterProfile.mjs';

const commonPercentage = 0.105;
const uncommonPercentage = 0.043;
const rarePercentage = 0.02;
const legendaryPercentage = 0.005;

export const cats = [
    // common cats
    new FighterProfile("Ginger", "Fierce orange warrior", "cat", "/img/test.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Coffee", "Caffeine-fueled fighter", "cat", "/img/test.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Chi", "Sweet homebody", "cat", "/img/test.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Tux", "Fanciest cat on the block", "cat", "/img/test.png", 40, 6, 0.03, "common", commonPercentage),
    new FighterProfile("Midnight", "Stealthy spy", "cat", "/img/test.png", 40, 6, 0.04, "common", commonPercentage),
    new FighterProfile("Shadow", "Mysterious wanderer", "cat", "/img/test.png", 60, 4, 0.04, "common", commonPercentage),
    new FighterProfile("Mittens", "Sanguine sleepyhead", "cat", "/img/test.png", 60, 4, 0.04, "common", commonPercentage),
    // uncommon cats
    new FighterProfile("Potato chip", "Snack-loving siamese", "cat", "/img/test.png", 60, 7, 0.05, "uncommon", uncommonPercentage),
    new FighterProfile("Princess Snowball", "Do not disrespect the princess!", "cat", "/img/test.png", 60, 7, 0.05, "uncommon", uncommonPercentage),
    new FighterProfile("Panda", "Cute but deadly", "cat", "/img/test.png", 50, 8, 0.06, "uncommon", uncommonPercentage),
    new FighterProfile("Fluffy", "The fluffiest feline", "cat", "/img/test.png", 70, 6, 0.06, "uncommon", uncommonPercentage),
    new FighterProfile("Shelly", "Sophisticated sweetie", "cat", "/img/test.png", 70, 6, 0.06, "uncommon", uncommonPercentage),
    // rare cats
    new FighterProfile("Mr. Big Paws", "Humongous harbinger", "cat", "/img/test.png", 80, 8, 0.07, "rare", rarePercentage),
    new FighterProfile("Beanie", "Beguiling beauty", "cat", "/img/test.png", 80, 8, "rare", 0.08, rarePercentage),
    // legendary cats
    new FighterProfile("Tony", "Might just be a tiger", "cat", "/img/test.png", 80, 11, 0.1, "legendary", legendaryPercentage),
    new FighterProfile("Prisma", "Elusive elegance", "cat", "/img/test.png", 100, 10, 0.15, "legendary", legendaryPercentage),
];