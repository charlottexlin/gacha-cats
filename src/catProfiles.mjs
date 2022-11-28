// profiles for cats
import {FighterProfile, commonPercentage, uncommonPercentage, rarePercentage, legendaryPercentage} from './fighterProfile.mjs';

export const cats = [
    // common cats
    new FighterProfile("Ginger", "Fierce orange warrior", "cat", "/img/cats/ginger.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Coffee", "Caffeine-fueled fighter", "cat", "/img/cats/coffee.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Chi", "Sweet homebody", "cat", "/img/cats/chi.png", 50, 5, 0.03, "common", commonPercentage),
    new FighterProfile("Tux", "Fanciest cat on the block", "cat", "/img/cats/tux.png", 40, 6, 0.03, "common", commonPercentage),
    new FighterProfile("Midnight", "Stealthy spy", "cat", "/img/cats/midnight.png", 40, 6, 0.04, "common", commonPercentage),
    new FighterProfile("Shadow", "Mysterious wanderer", "cat", "/img/cats/shadow.png", 60, 4, 0.04, "common", commonPercentage),
    new FighterProfile("Mittens", "Sanguine sleepyhead", "cat", "/img/cats/mittens.png", 60, 4, 0.04, "common", commonPercentage),
    // uncommon cats
    new FighterProfile("Potato chip", "Snack-loving siamese", "cat", "/img/cats/potatochip.png", 60, 7, 0.05, "uncommon", uncommonPercentage),
    new FighterProfile("Princess Snowball", "Do not disrespect the princess!", "cat", "/img/cats/princesssnowball.png", 60, 7, 0.05, "uncommon", uncommonPercentage),
    new FighterProfile("Panda", "Cute but deadly", "cat", "/img/cats/panda.png", 50, 8, 0.06, "uncommon", uncommonPercentage),
    new FighterProfile("Fluffy", "The fluffiest feline", "cat", "/img/cats/fluffy.png", 70, 6, 0.06, "uncommon", uncommonPercentage),
    new FighterProfile("Shelly", "Sophisticated sweetie", "cat", "/img/cats/shelly.png", 70, 6, 0.06, "uncommon", uncommonPercentage),
    // rare cats
    new FighterProfile("Mr. Big Paws", "Humongous harbinger", "cat", "/img/cats/mrbigpaws.png", 80, 8, 0.07, "rare", rarePercentage),
    new FighterProfile("Beanie", "Beguiling beauty", "cat", "/img/cats/beanie.png", 80, 8, 0.08, "rare", rarePercentage),
    // legendary cats
    new FighterProfile("Tony", "Might just be a tiger", "cat", "/img/cats/tony.png", 80, 11, 0.1, "legendary", legendaryPercentage),
    new FighterProfile("Prisma", "Elusive elegance", "cat", "/img/cats/prisma.png", 100, 10, 0.15, "legendary", legendaryPercentage),
];