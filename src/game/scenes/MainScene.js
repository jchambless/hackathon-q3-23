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

export class MainScene extends Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image("sky", "assets/1.png");
    this.load.image("city_layer1", "assets/2.png");
    this.load.image("city_layer2", "assets/3.png");
    this.load.image("city_layer3", "assets/4.png");
    this.load.image("city_layer4", "assets/5.png");

    this.load.image("level_tiles", "assets/tilemaps/maps/level1.png");
    this.load.tilemapTiledJSON("level_tileset", "assets/tilemaps/maps/level1.json");

    this.load.spritesheet('player', 
    'assets/movementGoose.png',
    { frameWidth: 24, frameHeight: 32 }
);

    // Added just so can test the parallax scrolling
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
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

    //this.physics.add.sprite(width / 2, height / 2, "road_tile");
    const level1 = this.add.image(0, height, "level_tiles").setOrigin(0, 1);
    this.add.image(level1.width, height, "level_tiles").setOrigin(0, 1);

    this.cameras.main.setBounds(0, 0, width * 3, height);
    this.player = this.physics.add.sprite(this.screenCenterX, height, 'player');

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
      this.player.body.setGravityY(300);
      this.player.setCollideWorldBounds(true);

      // adds collider between player and platforms
      this.physics.add.collider(this.player, this.level1);

      this.moveLeft = false;
      this.moveRight = false; 
  }

  update() {

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
    
    this.cameras.main.startFollow(this.player);
  }
}