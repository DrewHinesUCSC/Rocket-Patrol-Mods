//Attempted some fixes for buggy Pages, it broke the game and i am unsure if it is game or 
//browser issues, reverting back to previous version


class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create(){

        //start background music and check if it is still playing, having
        //issues with music coming back on when restarting and overlapping if
        //it just keeps playing
        let bgMusic = this.sound.get('Project3BG')
        if(!bgMusic || !bgMusic.isPlaying){
            if(!bgMusic){
                bgMusic = this.sound.add('Project3BG', { loop: true })
            }
            bgMusic.play()
        }

        //place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480, 'starfield').setOrigin(0,0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, 
        borderUISize * 2, 0x00FF00).setOrigin(0,0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize,
            0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(0,0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height,
            0xFFFFFF).setOrigin(0,0);   

        //ad rocket(P1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding,
            'rocket').setOrigin(0.5,0)
        
        //add 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship',
            0,30).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + 
            borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)

        //Created new ship that looks like a bat
        //increased it's velocity and made it smaller
        //also increase point value when hit

        this.ship03 = new BatRocket(this, game.config.width, borderUISize*6 + borderPadding*4, 'batrocket',
            0,25).setOrigin(0,0)
        this.ship03.moveSpeed = 6
        this.ship03.setSize(40, 20)
        this.ship03.setScale(0.7)
        

        //define keys
        keyFIRE = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET =
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)    

        //initialize score
        this.p1Score = 0

        //display score
        let scoreConfig ={
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig)
        
        // Added timer to count down remainng seconds (3 Points)
        scoreConfig.fixedWidth = 100
        this.timeLeft = this.add.text(game.config.width - borderUISize - borderPadding - 100, borderUISize + borderPadding * 2, game.settings.gameTimer / 1000, scoreConfig)

        //GAME OVER flag
        this.gameOver = false

        //60 second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            // stop background music when game ends, otherwise it overlaps
            this.sound.stopByKey('Project3BG')
            
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)
    }

    update(){

        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)){
            this.sound.stopByKey('Project3BG')
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.sound.stopByKey('Project3BG')
            this.scene.start('menuScene')
        }


        this.starfield.tilePositionX -= 4
        if(!this.gameOver){
        this.p1Rocket.update()
        this.ship01.update()
        this.ship02.update()
        this.ship03.update()
        
        // update timer display
        this.timeLeft.text = Math.ceil(this.clock.getRemaining() / 1000)
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        else if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        else if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        // had ot add a true/false flag to track when the rocket misses, decided to
        //make penalty harsher than reward, otherwise player could continue time
        //indefinitely (5 Points)

        if(this.p1Rocket.justMissed){
            this.p1Rocket.justMissed = false // clear flag immediately
            // subtract time on miss
            let remainingTime = this.clock.getRemaining()
            let penaltyTime = 5000 // 5 second penalty
            let newTime = Math.max(0, remainingTime - penaltyTime)
            this.clock.remove()
            if(newTime > 0){
                this.clock = this.time.delayedCall(newTime, () => {
                    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', {
                        fontFamily: 'Courier',
                        fontSize: '28px',
                        backgroundColor: '#F3B141',
                        color: '#843605',
                        align: 'right',
                        padding: { top: 5, bottom: 5 },
                        fixedWidth: 0
                    }).setOrigin(0.5)
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', {
                        fontFamily: 'Courier',
                        fontSize: '28px',
                        backgroundColor: '#F3B141',
                        color: '#843605',
                        align: 'right',
                        padding: { top: 5, bottom: 5 },
                        fixedWidth: 0
                    }).setOrigin(0.5)
                    this.gameOver = true
                }, null, this)
            } else {
                // time ran out
                this.gameOver = true
            }
        }
    }

    checkCollision(rocket, ship){
        //simple AABB check
        if(rocket.x < ship.x + ship.width && 
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y){
            return true
           } else {
            return false
           }
    }

    shipExplode(ship){
        //temporarily hidde ship
        ship.alpha = 0
        //create explosion at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode')              //play explode animation
        boom.on('animationcomplete', () => {    //callback after anim completes
            ship.reset()                        //reset ship position
            ship.alpha = 1                      //make ship visible again
            boom.destroy()                      //remove explosion sprite
        })
        //score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        
        // add bonus time on successful hit, had to add new text
        // still slightly buggy
        let remainingTime = this.clock.getRemaining()
        let bonusTime = 3000 // 3 second bonus
        this.clock.remove()
        this.clock = this.time.delayedCall(remainingTime + bonusTime, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: { top: 5, bottom: 5 },
                fixedWidth: 0
            }).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: { top: 5, bottom: 5 },
                fixedWidth: 0
            }).setOrigin(0.5)
            this.gameOver = true
        }, null, this)

        this.playRandExplosion()
    }


    // Created 4 new explosion sounds which plays randomly on impact (3 Points)
    playRandExplosion(){
        switch(Math.floor(Math.random() * 4)){
            case 0: 
                this.sound.play('Random')
                break
            case 1:
                this.sound.play('Random-2')
                break
            case 2:
                this.sound.play('Random-3')
                break
            case 3:
                this.sound.play('Boom')
                break
            default:
                console.log('Error: Invalid Sound')

        }
    }
}