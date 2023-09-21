import { Scene } from "phaser";

const createParallaxLayer = (scene, count, texture, scrollFactor) => {
  let x = 0;
  for (let i = 0; i < count; ++i) {
    const layer = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScale(2)
      .setScrollFactor(scrollFactor);
    x += layer.width;
  }
}

const setScore = (scoreText, score) => {
  scoreText.setText($`Score: ${score}`);
}

export class MainScene extends Scene {
  constructor() {
    super({ key: 'MainScene' });
  }
  
  lastFired = 0;
  stats;
  speed;
  bullets;
  scoreText;
  score = 0;

  preload() {
    this.load.image("sky", "assets/1.png");
    this.load.image("city_layer1", "assets/2.png");
    this.load.image("city_layer2", "assets/3.png");
    this.load.image("city_layer3", "assets/4.png");
    this.load.image("city_layer4", "assets/5.png");

    this.load.image("tiles", "assets/tilemaps/Tiles.png");
    this.load.image("props", "assets/tilemaps/Props-01.png");
    this.load.image("buildings", "assets/tilemaps/Buildings.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/maps/level1.json");

    this.load.spritesheet('player', 
    'assets/largeMovementGoose.png',
    { frameWidth: 120, frameHeight: 160 }
);
    this.load.image('bottle', 'assets/smallestPlayerProjectile.png');
    this.load.spritesheet('enemy', 'assets/enemy3.png', { frameWidth: 80, frameHeight: 125 });
    this.load.audio('bgm', 'assets/HONK HONK AM GOOSE.mp3');

    // Added just so can test the parallax scrolling
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.music =  this.sound.add('bgm', {
      volume: 0.4,
      loop: true
    })
  
    this.music.play()

    const width = this.scale.width;
    const height = this.scale.height;
    this.screenCenterX = width / 2;


    this.add.image(width * 0.5, height * 0.5, 'sky')
      .setScale(2)
      .setScrollFactor(0);

    createParallaxLayer(this, 5, "city_layer1", 0.25);
    createParallaxLayer(this, 5, "city_layer2", 0.5);
    createParallaxLayer(this, 5, "city_layer3", 1);
    createParallaxLayer(this, 5, "city_layer4", 1.25);

    this.map = this.make.tilemap({key: "map", tileHeight: 16, tileWidth: 16});
    this.tileset = this.map.addTilesetImage("Tiles", "tiles");
    this.props = this.map.addTilesetImage("Props", "props");
    this.buildings = this.map.addTilesetImage("Buildings", "buildings");
    
    this.buildingLayer2 = this.map.createLayer("Building Layer 2", this.buildings);
    this.buildingLayer1 = this.map.createLayer("Building Layer", this.buildings);
    this.propsLayer1 = this.map.createLayer("Clutter Layer", this.props);
    this.propsLayer2 = this.map.createLayer("Clutter Layer 2", this.props);
    this.roadLayer = this.map.createLayer("Road Layer", this.tileset);
    
    this.buildingLayer2.setPosition(0, height - this.buildingLayer2.getBounds().height);
    this.buildingLayer1.setPosition(0, height - this.buildingLayer1.getBounds().height);
    this.propsLayer1.setPosition(0, height - this.propsLayer1.getBounds().height);
    this.propsLayer2.setPosition(0, height - this.propsLayer2.getBounds().height);
    this.roadLayer.setPosition(0, height - this.roadLayer.getBounds().height);

    this.map.setCollision([0, 1, 2, 3, 6, 7, 42, 43, 44, 45, 46, 47, 52, 53], true);

    this.cameras.main.setBounds(0, 0, width * 3, height);
    this.player = this.physics.add.sprite(100, 20, 'player');

        // adds animations for player
        if (!this.anims.exists('left')) {
        this.anims.create({
          key: "left",
          frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1,
        });
      }

      if (!this.anims.exists('turn')) {
        this.anims.create({
          key: "turn",
          frames: [{ key: 'player', frame: 5 }],
        });
      }

      if (!this.anims.exists('right')) {
        this.anims.create({
          key: "right",
          frames: this.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
          frameRate: 10,
          repeat: -1,
        });
      }

        // sets player physics
      this.player.body.setGravityY(500);
      this.player.body.setGravityY(500);
      this.player.setCollideWorldBounds(true);

      // adds collider between player and platforms
      this.physics.add.collider(this.player, this.roadLayer);

      this.moveLeft = false;
      this.moveRight = false; 

      this.enemies = this.physics.add.group({
        gravityY: 500,
      });
      this.physics.add.collider(this.enemies, this.roadLayer);
      
      const createEnemy = () => {
        const camera = this.cameras.main;
        const cameraX = camera.scrollX;
        const cameraWidth = camera.width;

        const spawnX = cameraX + cameraWidth;
        const spawnY = height - 200;

        const enemy = this.enemies.create(spawnX, spawnY, 'enemy');
        const minVelocity = 100;
        const maxVelocity = 300;
        const velocity = Phaser.Math.Between(minVelocity, maxVelocity);
        enemy.setVelocityX(0 - velocity);
        enemy.anims.play('enemy_left', true);

        const minJumpTime = 1000;
        const maxJumpTime = 2500;
    
        const jump = () => {
            if (enemy.body.blocked.down || enemy.body.touching.down) {
              const minJumpVelocity = -300; 
              const maxJumpVelocity = -800;
              const jumpVelocity = Phaser.Math.Between(minJumpVelocity, maxJumpVelocity);
      
              enemy.setVelocityY(jumpVelocity);
              enemy.body.setAccelerationX(-30); 
            }
        };
    
        const jumpTimer = this.time.addEvent({
            delay: Phaser.Math.Between(minJumpTime, maxJumpTime),
            callback: jump,
            callbackScope: this,
            loop: true,
        });
    
        enemy.on('destroy', () => {
            jumpTimer.remove();
        });
      }
      
      const createEnemyLoop = this.time.addEvent({
        delay: Math.floor(Math.random() * (4000 - 3000 + 1)) + 1000,
        callback: createEnemy,
        callbackScope: this,
        loop: true,
      });

      this.anims.create({
        key: "enemy_left",
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });

      class Bullet extends Phaser.GameObjects.Image
      {
          constructor (scene)
          {
              super(scene, 0, 0, 'bottle');

              this.speed = Phaser.Math.GetSpeed(400, 1);
          }

          fire (x, y)
          {
              this.body.setGravityY(0);
              this.setPosition(x + 40, y + 10);

              this.setActive(true);
              this.setVisible(true);
          }

          update (time, delta)
          {
            this.x += this.speed * delta;

            if (this.x > this.scene.scale.width + 50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
          }
      }

      this.bullets = this.physics.add.group({
          classType: Bullet,
          maxSize: 5,
          runChildUpdate: true,
      });

      this.speed = Phaser.Math.GetSpeed(300, 1);
      
      this.scoreText = this.add.text(16, 16, "Score: 0", {fontSize: '24px', fill: '#fff'});

      // Crash
      this.physics.add.collider(this.enemies, this.player, (player, enemy) => {
        this.scene.restart()
      });
    
    this.physics.add.collider(this.bullets, this.enemies, function(bullet, enemy) {
      bullet.destroy();
      enemy.destroy();
  });
  }

  update(time, delta) {

    if (this.cursors.left.isDown) {
      this.moveLeft = true;
    } 
    else if (this.cursors.right.isDown) {
      this.moveRight = true;
    }
    else {
      this.moveLeft = false;
      this.moveRight = false;
    }

    if (this.moveLeft && !this.moveRight) {
      this.player.setVelocityX(0 - 200);   
      this.player.anims.play('left', true);
    }
  
    else if (this.moveRight && !this.moveLeft) {
       this.player.setVelocityX(200);    
       this.player.anims.play('right', true);
    }
  
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && time > this.lastFired && !this.moveLeft)
    {
        const bullet = this.bullets.get();

        if (bullet)
        {
            bullet.fire(this.player.x, this.player.y);

            this.lastFired = time + 300;
        }
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(-300);
}
    
    this.cameras.main.startFollow(this.player);
  }
}