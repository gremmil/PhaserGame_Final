import Phaser from 'phaser';
import { MoveDirectionI, MoveRangenI } from '../interfaces/general.interface';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private movementDirection: MoveDirectionI;
  private moveRange: MoveRangenI;

  constructor(scene: Phaser.Scene, x: number, y: number, spriteKey: string) {
    super(scene, x, y, spriteKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.enableUpdate();
    this.setOrigin(0.5);
    //this.setCollideWorldBounds(true);
    this.speed = Phaser.Math.Between(50, 150);
    this.movementDirection = {
      x: 0,
      y: 0
    }
    this.moveRange = {
      min: {
        x: x - 100,
        y: y - 100
      },
      max: {
        x: x + 100,
        y: y + 100
      },
    }
    scene.add.existing(this);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.move();
  }

  private move() {
    this.x += this.speed * this.movementDirection.x * this.scene.game.loop.delta / 1000;
    this.y += this.speed * this.movementDirection.y * this.scene.game.loop.delta / 1000;

    if (this.x > this.moveRange.max.x) {
      this.movementDirection.x = -1; // Cambia la dirección para mover hacia la izquierda en el eje X
    } else if (this.x < this.moveRange.min.x) {
      this.movementDirection.x = 1; // Cambia la dirección para mover hacia la derecha en el eje X
    }

    if (this.y > this.moveRange.max.y) {
      this.movementDirection.y = -1; // Cambia la dirección para mover hacia arriba en el eje Y
    } else if (this.y < this.moveRange.min.y) {
      this.movementDirection.y = 1; // Cambia la dirección para mover hacia abajo en el eje Y
    }
    /* if (this.y > this.scene.sys.canvas.height + this.height) {
      this.destroy();
    } */
  }

  setMoveDirection(direction: MoveDirectionI) {
    this.movementDirection = direction;
  }
  setMoveRange(range: MoveRangenI) {
    this.moveRange = range;
  }
}