


class Scene0 extends Phaser.Scene {
    constructor(){
        super({
            key: 'Scene0'
        })
    }

    preload() {
        this.load.image('road', 'ressources/images/road.png');
    }

    create() {
        this.add.image(270, 280, 'road').setScale(0.65);

        this.add.text(210, 105, 'Click to Play', {
            fontSize: '50px',
            fontFamily: 'Helvetica',
            fill: '#000000', 
            backgroundColor: '#fff000', 
            borderRadius: '20px'
            
        }).setPadding(50);

        this.input.on('pointerup', () => {
            // Add logic to transition from StartScene to GameScene:
            this.scene.stop('Scene0');
            this.scene.start('Scene1')
                  
        });
    }
}



class Scene1 extends Phaser.Scene{
    constructor(){
        super({
            key: 'Scene1'
        })
    }

    preload() {
        //this.load.image('ambulance', 'ressources/images/ambulance.png');
        this.load.spritesheet('ambulance', 'ressources/images/ambulance3.png', {
            frameWidth: 227, frameHeight: 117})
        this.load.image('delivery', 'ressources/images/delivery.png');
        this.load.image('sport', 'ressources/images/sport.png');
        this.load.image('suv', 'ressources/images/suv.png');
        this.load.image('truck', 'ressources/images/truck.png');
        this.load.image('van', 'ressources/images/van.png');
        this.load.image('road', 'ressources/images/road.png');
        this.load.image('taxi', 'ressources/images/taxi.png');
        this.load.image('hospital','ressources/images/hospital.png');
        this.load.audio('backsound', 'ressources/sound/backmusic.mp3');
        this.load.audio('collision', 'ressources/sound/collision.mp3');
        this.load.audio('crowd', 'ressources/sound/crowd.mp3');
        this.load.audio('siren', 'ressources/sound/siren.mp3');
    
    }

    create() {
        this.add.image(270, 280, 'road').setScale(0.65);
        gameState.active = true;


        this.input.on('pointerup', ()=>{
            if (gameState.active === false) {
                this.scene.restart();

            }
        })
        
        gameState.music = this.sound.add('backsound');
        let configMusic = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0

        }

        let configCrowd = {
            mute: false,
            volume: 3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0

        }

        let configSiren = {
            mute: false,
            volume: 2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0

        }
        
        gameState.collison = this.sound.add('collision');
        gameState.crowd = this.sound.add('crowd');
        gameState.siren = this.sound.add('siren');
        gameState.siren.play(configSiren);
        
        gameState.music.play(configMusic);


        gameState.player = this.physics.add.sprite(700, 230, 'ambulance').setScale(.5);

        this.anims.create({
            key: 'siren',
            frames: this.anims.generateFrameNumbers('ambulance', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        gameState.player.anims.play('siren', true);

        gameState.player.flipX = true;
        gameState.player.body.allowGravity = false;
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.player.setCollideWorldBounds(true);
        gameState.carsPassed = 0;
        gameState.enemies = this.add.group();
        gameState.level = 1;
        
        let r1= this.add.rectangle(-100, 53, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r1);
        let r2= this.add.rectangle(-100, 143, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r2);
        let r3= this.add.rectangle(-100, 230, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r3);
        let r4= this.add.rectangle(-100, 320, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r4);
        let r5= this.add.rectangle(-100, 408, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r5);
        let r6= this.add.rectangle(-100, 497, 20, 0.5, 0xFFFFFF, 1)
        gameState.enemies.add(r6);

        let cars = this.physics.add.group();
        

        let genCars = () => {
            let randomCar = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
            let randomNum = Math.floor(Math.random() * 6)

            if (randomNum === 0) {
                cars.create(randomCar.x, randomCar.y, 'delivery').setScale(0.5);;
                cars.flipX = true;
                gameState.carsPassed ++;
                
            } else if (randomNum === 1) {
                cars.create(randomCar.x, randomCar.y, 'sport').setScale(0.5);;
                gameState.carsPassed ++;
            } else if (randomNum === 2) {
                cars.create(randomCar.x, randomCar.y, 'suv').setScale(0.5);;
                gameState.carsPassed ++;
            } else if (randomNum === 3) {
                cars.create(randomCar.x, randomCar.y, 'truck').setScale(0.5);;
                gameState.carsPassed ++;
            } else if (randomNum === 4) {
                cars.create(randomCar.x, randomCar.y, 'van').setScale(0.5);
                gameState.carsPassed ++;
            } else {
                cars.create(randomCar.x, randomCar.y, 'taxi').setScale(0.5);
                gameState.carsPassed ++;
                console.log(gameState.carsPassed)
            }
        }

        gameState.carLoop = this.time.addEvent({
            delay: 1500,
            callback: genCars, 
            callbackScope: this, 
            loop: true
            
        });

        this.physics.add.collider(gameState.player, cars, ()=> {
            gameState.active = false;
            this.physics.pause();
            gameState.music.pause();
            gameState.siren.pause();
            gameState.collison.play();
            gameState.player.anims.pause();
            this.add.text(260, 105, 'Game Over! \n Play Again', {
                fontSize: '40px',
                fontFamily: 'Helvetica',
                fill: '#000000', 
                backgroundColor: '#fff000', 
                borderRadius: '20px'
                
            }).setPadding(16);
        })

        
        let yRandom = Math.floor(Math.random()* 6);
        let y;

        if (yRandom === 0) {
            y = 53;
        } else if (yRandom === 1) {
            y = 143;
        } else if (yRandom === 2) {
            y = 233;
        } else if (yRandom === 3) {
            y = 320;
        } else if (yRandom === 4) {
            y = 408;
        } else {
            y = 497;
        }

        gameState.hospital = this.physics.add.sprite(-100, y, 'hospital').setScale(0.15)
        gameState.hospital.body.allowGravity = false;
        this.physics.add.collider(gameState.player, gameState.hospital, ()=> {
            gameState.active = false;
            gameState.music.pause();
            gameState.siren.pause();
            gameState.crowd.play(configCrowd)
            this.physics.pause();

            this.add.text(280, 105, ' You Won! \nPlay Again', {
                fontSize: '40px',
                fontFamily: 'Helvetica',
                fill: '#000000', 
                backgroundColor: '#fff000', 
                borderRadius: '20px'
                
            }).setPadding(16);
        })


        gameState.instructions = this.add.text(100, 2, 'Avoid the Traffic and Reach the Hospital after Level 5', {
            fontSize: '20px',
            fontFamily: 'Helvetica',
            fill: '#000000', 
            backgroundColor: '#fff000', 
            borderRadius: '20px' 
        }).setPadding(10);
        
    }


    update(){
        if (gameState.active) {
            if (gameState.cursors.left.isDown) {
                gameState.player.setVelocityX(-300)
                gameState.player.flipX = true;
            } else if (gameState.cursors.right.isDown){
                gameState.player.setVelocityX(300)
                gameState.player.flipX = false;
            } else if (gameState.cursors.up.isDown) {
                gameState.player.setVelocityY(-300)
            } else if (gameState.cursors.down.isDown) {
                gameState.player.setVelocityY(300)  
            } else {
                gameState.player.setVelocityY(0)
                gameState.player.setVelocityX(0)
            }   
            
            if (gameState.carsPassed > 1 && gameState.carsPassed <=25) {
                let level1 = this.add.text(670, 2, 'Level 1', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
            } else if (gameState.carsPassed > 25 && gameState.carsPassed <=50) {
                let level2 = this.add.text(670, 2, 'Level 2', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
                gameState.carLoop.delay = 900;
                gameState.instructions.destroy();
                
               
            } else if (gameState.carsPassed > 50 && gameState.carsPassed <=75) {
                let level3 = this.add.text(670, 2, 'Level 3', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
                gameState.carLoop.delay = 700;

            } else if (gameState.carsPassed > 75 && gameState.carsPassed <=100) {
                let level4 = this.add.text(670, 2, 'Level 4', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
                gameState.carLoop.delay = 600;

            } else if (gameState.carsPassed > 100 && gameState.carsPassed <=125) {
                let level5 = this.add.text(670, 2, 'Level 5', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
                gameState.carLoop.delay = 500;

            } else if (gameState.carsPassed > 125) {
                let levelhospital = this.add.text(575, 2, 'Go to the Hospital', {
                    fontSize: '20px',
                    fontFamily: 'Helvetica',
                    fill: '#000000', 
                    backgroundColor: '#fff000', 
                    borderRadius: '20px' 
                }).setPadding(5);
                gameState.hospital.x = 50;
            }
        }
    }
}



const gameState = {
    active: false
};

const config = {
    type: Phaser.AUTO,
    width: 750,
    height: 550,
    parent: 'phaser',
    backgroundColor: '000fff', 
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { x: 100}, 
            enableBody: true
        }
    }, scene: [Scene0, Scene1]


}

const game = new Phaser.Game(config)


let pass = document.getElementById('pass');
let phaser = document.getElementById('phaser');
let header = document.getElementById('header');
let button = document.getElementById('submit');
let lock = document.getElementById('lock')











