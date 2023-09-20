import { Scene } from "phaser";

export class MainScene extends Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {

  }

  create() {
    this.add.text(100, 100, "Hello Phaser!", {
      font: "24px Courier",
      fill: "#ffffff",
    });
  }

  update() {
    
  }
}