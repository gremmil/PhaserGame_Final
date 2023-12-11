import Phaser from 'phaser';
import GameOverScene from "./scenes/GameOverScene";
import TitleScene from "./scenes/TitleScene";
import Level1Scene from './scenes/Level1Scene';
import Level2Scene from './scenes/Level2Scene';
import Level3Scene from './scenes/Level3Scene';
import Level4Scene from './scenes/Level4Scene';
import 'phaser/src/physics/arcade';
import HUDScene from './scenes/HUDScene';


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  /* scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  }, */
  width: 1024 * 0.8,
  height: 768 * 0.8,
  autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  parent: 'game-container',
  scene: [TitleScene, GameOverScene, HUDScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      checkCollision: {
        left: true,
        right: true,
        down: true,
        up: true
      },
      debug: false
    }
  }
};

export const game = new Phaser.Game(config);
