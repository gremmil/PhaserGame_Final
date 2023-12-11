import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  private gameWidth: number;
  private gameHeight: number;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(1);
    this.setVelocityY(-500);
    this.gameWidth = Number(scene.sys.game.config.width);
    this.gameHeight = Number(scene.sys.game.config.height);

  }

  update = () => {
    if (this.y < -50 || this.y > this.gameHeight + 50) {
      this.destroy();
    }
    if (this.x < -50 || this.x > this.gameWidth + 50) {
      this.destroy();
    }
  }
}