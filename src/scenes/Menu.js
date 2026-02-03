class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

preload(){
    //load images/tile sprites
    this.load.image('rocket','./assets/rocket.png')
    this.load.image('spaceship','./assets/spaceship.png')
    this.load.image('starfield','./assets/starfield.png')
    this.load.image('batrocket', './assets/BatRocket.png')
    //Adding own image for menu background and change font (3 Points)
    this.load.image('redsky','./assets/Red_Sky.png')

    //load webfont source: Google
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');



    //load spritesheet
    this.load.spritesheet('explosion','./assets/explosion.png',{
        frameWidth: 64,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 9
    })

    //load audio
    this.load.audio('sfx-select', './assets/sfx-select.wav')
    this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
    this.load.audio('sfx-shot', './assets/sfx-shot.wav')
    this.load.audio('Boom', './assets/boom.wav')
    this.load.audio('Random-2', './assets/Random-2.wav')
    this.load.audio('Random-3', './assets/Random-3.wav')
    this.load.audio('Random','./assets/Random.wav')
    this.load.audio('Project3BG', './assets/Project 3.wav')
}

    create(){
        //loading fonts from google fonts for Phaser, source in create() method
        WebFont.load({
        google: {
            families: ['Press Start 2P', 'Bangers'] // Add your fonts here
        }})

        //add background image from own library
        //created background track using Logic Pro
        this.add.image(0, 0, 'redsky').setOrigin(0, 0)
        this.bgMusic = this.sound.add('Project3BG', { 
            loop: true })
        this.bgMusic.play()
        

        //animation configuration
        if (!this.anims.exists('explode')) {
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion',{start: 0, end: 9, first: 0}),
                frameRate: 30
            })
        }

        let menuConfig = {
            fontFamily: 'Bangers',
            fontSize: '28px',
            backgroundColor: '#f00a0aff',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use <- -> arrows to move & (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#f00a0aff'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- for Novice or -> for Expert', 
        menuConfig).setOrigin(0.5)
        
        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            //easy
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx-select')
            this.sound.stopAll()
            this.scene.start('playScene')
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            //hard
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx-select')
            this.scene.start('playScene')
        }
    }
}