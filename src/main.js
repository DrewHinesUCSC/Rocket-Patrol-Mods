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