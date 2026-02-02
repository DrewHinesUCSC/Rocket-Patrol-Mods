/*
Drew Hines
Rocket Patrol: The Burning
The project took ~12 hours
//Added four new sound effects that play at random +3
//Altered menu to include personal photo and changed font +3
//Display countdonwn timer +3
//Added bonus and penalty to score +5
//Create new rocket that is faster +5
//Create background track + 1 
//Added a Google Font to menu screen "Blaster"
//Shrank the hit box size on BatRocket to make hits
//more realistic

// I watched a few videos from YouTuber lowpolyprincess who does
//very easy to follow Phaser tutorials, in particular
//Phaser Tutorial: Make Your First 2D Javascript Game
//https://www.youtube.com/watch?v=0qtg-9M3peI

*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//reserve kyeboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

//initialize game settings with default values
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;