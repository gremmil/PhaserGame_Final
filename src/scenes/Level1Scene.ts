import Phaser from 'phaser';
import HUDScene from './HUDScene';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Bullet from '../objects/Bullet';
import Popup from '../shared/Popup';
import { game } from '../main';

export default class Level1Scene extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  private player: Player;
  private bullets: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private objects: Phaser.GameObjects.Group;
  private score: number;
  private lives: number;
  private emitter: Phaser.Events.EventEmitter;
  private canCollide: boolean = true;

  constructor() {
    super('Level1Scene');
    this.score = 0;
    this.lives = 3;
  }

  preload() {
    this.load.image('background_after', 'img/backgrounds/lvl1_after.png');
    this.load.image('background_before', 'img/backgrounds/lvl1_before.png');
    this.load.spritesheet('player', 'img/spritesheets/player.png', {
      frameWidth: 93,
      frameHeight: 126
    })
    this.load.spritesheet('bullet_player', 'img/spritesheets/bullet_player.png', {
      frameWidth: 62,
      frameHeight: 84
    })
    this.load.spritesheet('enemy', 'img/spritesheets/enemy_1.png', {
      frameWidth: 32,
      frameHeight: 32
    })
  }
  create() {
    this.background = this.add.tileSprite(0, 0, 0, 0, "background_after");
    this.background.setPosition(this.game.canvas.width / 2, this.game.canvas.height / 2);
    this.background.setScale(0.5); // Ajusta la escala si es necesario
    // Asegurarse de que el tileSprite se muestre completo
    this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);

    //Balas
    this.bullets = this.physics.add.group({
      classType: Bullet,
      createCallback: (bullet: Phaser.Physics.Arcade.Sprite) => {
        bullet.setTexture('bullet_player'); // Asigna el nombre del sprite
      },
      maxSize: 5,
      runChildUpdate: true
    });
    // Jugador
    this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.9, 'player');
    this.player.setBullets(this.bullets, { x: 0, y: -1 });
    this.player.setMoveDirection({ x: true, y: true });
    // Grupos de enemigos y objetos
    this.enemies = this.add.group();

    // Crear enemigos NPC
    this.createNPCEnemies();

    // Colisiones
    this.physics.add.overlap(this.enemies, this.player.getBullets(), (enemy, bullet) => {
      enemy.destroy();
      bullet.destroy();
      this.score += 10;
      this.emitter.emit('updateScore', this.score);
      if (this.enemies.getLength() === 0) {
        this.background = this.add.tileSprite(0, 0, 0, 0, "background_before");
        this.background.setPosition(this.game.canvas.width / 2, this.game.canvas.height / 2);
        this.background.setScale(0.5); // Ajusta la escala si es necesario
        // Asegurarse de que el tileSprite se muestre completo
        this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
        const popup = new Popup(this, this.game.canvas.width / 2, this.game.canvas.height / 2, '¡Nivel Completado!',
          '¡Felicidades!, lograste completar el objetivo. Con la eliminación de los mounstros pantanosos, los bofedales podrán revitalizarse'
          + ' y alimentar a la laguna y el Río Rímac. Tambien se restaurara la fauna y flora del lugar =).');

        const continueButton = popup.getContinueButton();
        continueButton.on('pointerdown', () => {
          this.scene.launch('HUDScene').bringToTop('HUDScene');
          this.scene.start('Level2Scene');
        });
      }


    });
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (this.canCollide) {
        this.canCollide = false;
        this.lives--;
        this.emitter.emit('updateLives', -1);
        this.time.delayedCall(1000, () => {
          this.canCollide = true;
        }, null, this);
        if (this.lives === 0) {
          this.scene.start('GameOverScene');
        }
      }
    });

    this.emitter = (this.scene.get('HUDScene') as HUDScene).getEmitter();
    this.emitter.emit('updateLives', this.lives);
  }

  update() {
    this.enemies.getChildren().forEach((enemy: Phaser.GameObjects.Sprite) => {
      enemy.update();
    });
  }

  private createNPCEnemies() {
    // Crear enemigos NPC en posiciones aleatorias
    const numEnemies = 5;
    for (let i = 0; i < numEnemies; i++) {
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const y = Phaser.Math.Between(50, this.scale.height - 200);
      const enemy = new Enemy(this, x, y, 'enemy');
      enemy.setMoveDirection({ x: Phaser.Math.RND.pick([1, -1]), y: 0 })
      enemy.setScale(2);
      this.enemies.add(enemy);
    }
  }

  private createScoreObjects() {
    // Crear objetos para el score en posiciones aleatorias
    const numObjects = 10;
    for (let i = 0; i < numObjects; i++) {
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const y = Phaser.Math.Between(50, this.scale.height - 200);
      const object = this.add.circle(x, y, 10, 0xff0000);
      this.objects.add(object);
    }
  }
}