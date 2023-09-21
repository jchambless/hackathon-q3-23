import { Game, AUTO, Scale } from 'phaser'
import { MainScene } from './scenes/MainScene'

export function launch() {
  new Game({
    type: AUTO,
    scale: {
      mode: Scale.RESIZE,
      width: window.innerWidth * window.devicePixelRatio,
      autoCenter: Scale.CENTER_BOTH,
      height: window.innerHeight * window.devicePixelRatio,
    },
    parent: "game",
    backgroundColor: "#201726",
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 300,
        },
      },
    },
    scene: MainScene
  });
}