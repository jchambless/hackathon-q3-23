import { Game, AUTO, Scale } from 'phaser'
import { MainScene } from './scenes/MainScene'

export function launch() {
  return new Promise((resolve, reject) => {
    resolve(new Game({
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
        default: "arcade"
      },
      scene: MainScene
    }));
  });
}