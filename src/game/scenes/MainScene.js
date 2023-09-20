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

    // Added just so can test the parallax scrolling
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.image(width * 0.5, height * 0.5, 'sky')
      .setScale(2)
      .setScrollFactor(0);

    createParallaxLayer(this, 5, "city_layer1", 0.25);
    createParallaxLayer(this, 5, "city_layer2", 0.5);
    createParallaxLayer(this, 5, "city_layer3", 1);
    createParallaxLayer(this, 5, "city_layer4", 1.25);

    this.cameras.main.setBounds(0, 0, width * 3, height, true);
  }

  update() {
    const cam = this.cameras.main;
    const speed = 5;

    if (this.cursors.left.isDown) {
      cam.scrollX -= speed;
    } 
    else if (this.cursors.right.isDown) {
      cam.scrollX += speed;
    }
  }
}