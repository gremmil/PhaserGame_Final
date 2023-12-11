import Phaser from 'phaser';
import Bullet from './Bullet';
import { MoveDirectionI } from '../interfaces/general.interface';
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed: number;
  private isFiring: boolean;
  private bullets: Phaser.GameObjects.Group;
  private shootSound: Phaser.Sound.BaseSound;
  private directionBullet: MoveDirectionI = { x: 0, y: 0 };
  private moveDirectionPlayer: { x: boolean, y: boolean } = { x: false, y: false };
  private jumpForce: number;
  private canDoubleJump: boolean;
  private canTripleJump: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string) {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.enableUpdate();
    this.setOrigin(0.5);
    this.setScale(0.5);
    this.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.speed = 200;
    this.isFiring = false;
    this.jumpForce = 500;
  }
  preload() {
    this.scene.load.audio('shootSound', 'assets/sounds/player/shoot.wav');
  }
  create() {
    this.shootSound = this.scene.sound.add('shootSound');
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.body.blocked.down) {
      this.canDoubleJump = true;
      this.canTripleJump = true;
    }
    this.handleInput();
    this.handleFiring();
  }
  private handleInput() {
    // Movimiento horizontal
    if (this.moveDirectionPlayer.x) {
      if (this.cursors.left.isDown) {
        this.setVelocityX(-this.speed);
        this.directionBullet = { x: -1, y: 0 };
      } else if (this.cursors.right.isDown) {
        this.setVelocityX(this.speed);
        this.directionBullet = { x: 1, y: 0 };
      } else {
        this.setVelocityX(0);
      }
    }

    if (this.moveDirectionPlayer.y) {
      // Movimiento vertical
      if (this.cursors.up.isDown) {
        this.setVelocityY(-this.speed);
        this.directionBullet = { x: 0, y: -1 };
      } else if (this.cursors.down.isDown) {
        this.setVelocityY(this.speed);
        this.directionBullet = { x: 0, y: 1 };
      } else {
        this.setVelocityY(0);
      }
    } else {
      // Salto inicial
      if (this.cursors.up.isDown /* && Phaser.Input.Keyboard.JustDown(this.cursors.up) */) {
        this.setVelocityY(-this.jumpForce);
      }
    }
  }
  private handleFiring() {
    if (this.isFiring) {
      return;
    }
    if (this.cursors.space.isDown) {
      const bullet = this.bullets.get(this.x, this.y - 10) as Bullet;
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(300 * this.directionBullet.y);
        bullet.setVelocityX(300 * this.directionBullet.x);
        bullet.setRotation(Phaser.Math.Angle.Between(0, 0, -this.directionBullet.y, this.directionBullet.x,));
        this.isFiring = true;
        this.scene.time.delayedCall(300, () => {
          this.isFiring = false;
        });
      }
    }
  }
  getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }
  setBullets(bullets: Phaser.GameObjects.Group, direction: MoveDirectionI) {
    this.bullets = bullets;
    this.directionBullet = direction;
  }

  setMoveDirection(move: { x: boolean, y: boolean }) {
    this.moveDirectionPlayer = move;
  }
}