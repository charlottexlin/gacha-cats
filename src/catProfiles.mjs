// profiles for cats
import {FighterProfile} from './fighterProfile.mjs';

export const cats = [
    // common cats (11%) - TODO might still adjust all these stats and probabilities depending on how i want the game played later on
    new FighterProfile("Ginger", "Fierce orange warrior", "cat", "/img/test.png", 50, 5, "common", 0.11),
    new FighterProfile("Coffee", "Caffeine-fueled fighter", "cat", "/img/test.png", 50, 5, "common", 0.11),
    new FighterProfile("Chi", "Sweet homebody", "cat", "/img/test.png", 50, 5, "common", 0.11),
    new FighterProfile("Tux", "Fanciest cat on the block", "cat", "/img/test.png", 40, 6, "common", 0.11),
    new FighterProfile("Midnight", "Stealthy spy", "cat", "/img/test.png", 40, 6, "common", 0.11),
    new FighterProfile("Shadow", "Mysterious wanderer", "cat", "/img/test.png", 60, 4, "common", 0.11),
    new FighterProfile("Mittens", "Sanguine sleepyhead", "cat", "/img/test.png", 60, 4, "common", 0.11),
    // uncommon cats (4%)
    new FighterProfile("Potato chip", "Snack-loving siamese", "cat", "/img/test.png", 60, 7, "uncommon", 0.04),
    new FighterProfile("Princess Snowball", "Do not disrespect the princess!", "cat", "/img/test.png", 60, 7, "uncommon", 0.04),
    new FighterProfile("Panda", "Cute but deadly", "cat", "/img/test.png", 50, 8, "uncommon", 0.04),
    new FighterProfile("Fluffy", "The fluffiest feline", "cat", "/img/test.png", 70, 6, "uncommon", 0.04),
    new FighterProfile("Shelly", "Sophisticated sweetie", "cat", "/img/test.png", 70, 6, "uncommon", 0.04),
    // rare cats (1%)
    new FighterProfile("Mr. Big Paws", "Humongous harbinger", "cat", "/img/test.png", 80, 8, "rare", 0.01),
    new FighterProfile("Beanie", "Beguiling beauty", "cat", "/img/test.png", 80, 8, "rare", 0.01),
    // legendary cats (0.5%)
    new FighterProfile("Tony", "Might just be a tiger", "cat", "/img/test.png", 80, 11, "legendary", 0.005),
    new FighterProfile("Prisma", "Elusive elegance", "cat", "/img/test.png", 100, 10, "legendary", 0.005),
];