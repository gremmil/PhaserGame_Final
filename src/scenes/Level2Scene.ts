import Phaser from 'phaser';
import Bullet from '../objects/Bullet';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Popup from '../shared/Popup';
import HUDScene from './HUDScene';
import { MoveDirectionI } from '../interfaces/general.interface';

export default class Level2Scene extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  private player: Player;
  private bullets: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private score: number;
  private lives: number;
  private emitter: Phaser.Events.EventEmitter;
  private canCollide: boolean = true;

  constructor() {
    super('Level2Scene');
    this.score = 0;
    this.lives = 3;
  }

  preload() {
    this.load.image('background_lvl2', 'img/backgrounds/lvl2.png');
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
    this.background = this.add.tileSprite(0, 0, 0, 0, "background_lvl2");
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
    this.player.setBullets(this.bullets, { x: 1, y: 0 });
    this.player.setMoveDirection({ x: true, y: false });
    this.player.setPosition(this.scale.width * 0.5, 200)
    this.configPlatforms();
    this.player.setGravityY(1000);

    // Grupos de enemigos y objetos
    this.enemies = this.add.group({
      classType: Enemy
    });

    // Crear enemigos NPC
    this.createNPCEnemies();

    // Colisiones
    this.physics.add.overlap(this.enemies, this.player.getBullets(), (enemy, bullet) => {
      enemy.destroy();
      bullet.destroy();
      this.score += 10;
      this.emitter.emit('updateScore', this.score);
      if (this.enemies.getLength() === 0) {
        const popup = new Popup(this, this.game.canvas.width / 2, this.game.canvas.height / 2, '¡Nivel Completado!',
          '¡Felicidades!, lograste completar el objetivo. Con la eliminación de los mounstros pantanosos, los pasivos mineros'
          + ' podran limpiarse y evitar algun peligro de contaminacion al rio =).');

        const continueButton = popup.getContinueButton();
        continueButton.on('pointerdown', () => {
          this.scene.launch('HUDScene').bringToTop('HUDScene');
          this.scene.start('Level3Scene');
        });
      }


    });
    this.physics.add.overlap(this.player, this.enemies, () => {
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

    // Obtener el emisor de eventos desde la escena HUDScene
    this.emitter = (this.scene.get('HUDScene') as HUDScene).getEmitter();
    this.emitter.emit('updateLives', 0);

  }

  update() {
    // Lógica de actualización del nivel 2
  }

  configPlatforms() {
    const platforms = this.physics.add.staticGroup();

    // Plataforma superior
    const platformTopLeft = platforms.create(this.scale.width * 0.15, 180, 'platform');
    platformTopLeft.setSize(this.scale.width * 0.30, 10);
    platformTopLeft.setDisplaySize(this.scale.width * 0.30, 10);


    const platformTopRight = platforms.create(this.scale.width * 0.8625, 180, 'platform');
    platformTopRight.setSize(this.scale.width * 0.275, 10);
    platformTopRight.setDisplaySize(this.scale.width * 0.275, 10);

    const platformTopMiddle = platforms.create(this.scale.width / 2 + 42.5, 180, 'platform');
    platformTopMiddle.setSize(this.scale.width * 0.175, 10);
    platformTopMiddle.setDisplaySize(this.scale.width * 0.175, 10);

    // Plataformas inferiores
    const platformLeft = platforms.create(this.scale.width / 8, 300, 'platform');
    platformLeft.setSize(this.scale.width / 4, 10);
    platformLeft.setDisplaySize(this.scale.width / 4, 10);
    const platformRight = platforms.create(this.scale.width * 0.875, 300, 'platform');
    platformRight.setSize(this.scale.width / 4, 10);
    platformRight.setDisplaySize(this.scale.width / 4, 10);

    // Plataforma del medio
    const platformMiddle = platforms.create(this.scale.width / 2, 380, 'platform');
    platformMiddle.setSize(this.scale.width / 4, 10);
    platformMiddle.setDisplaySize(this.scale.width / 4, 10);

    // Plataformas inferiores adicionales
    const platformBottomLeft = platforms.create(this.scale.width * 0.2125, this.scale.height * 0.75, 'platform');
    platformBottomLeft.setSize(this.scale.width * 0.425, 10);
    platformBottomLeft.setDisplaySize(this.scale.width * 0.425, 10);
    const platformBottomRight = platforms.create(this.scale.width * 0.7875, this.scale.height * 0.75, 'platform');
    platformBottomRight.setSize(this.scale.width * 0.425, 10);
    platformBottomRight.setDisplaySize(this.scale.width * 0.425, 10);

    // Agregar las plataformas al grupo de plataformas
    platforms.add(platformTopLeft);
    platforms.add(platformTopRight);
    platforms.add(platformTopMiddle);
    platforms.add(platformLeft);
    platforms.add(platformRight);
    platforms.add(platformMiddle);
    platforms.add(platformBottomLeft);
    platforms.add(platformBottomRight);
    platforms.setAlpha(0);
    // Establecer colisión entre el jugador y las plataformas
    this.physics.add.collider(this.player, platforms);
  }
  private createNPCEnemies() {

    const enemiesArr: Array<{ position: { x: number, y: number }, moveDirection: MoveDirectionI }> = [
      {
        position: {
          x: this.scale.width * 0.15,
          y: 150
        },
        moveDirection: {
          x: 1,
          y: 0
        }
      },
      {
        position: {
          x: this.scale.width * 0.85,
          y: 150
        },
        moveDirection: {
          x: -1,
          y: 0
        }
      },
      {
        position: {
          x: this.scale.width * 0.10,
          y: 270
        },
        moveDirection: {
          x: 1,
          y: 0
        }
      },
      {
        position: {
          x: this.scale.width * 0.90,
          y: 270
        },
        moveDirection: {
          x: -1,
          y: 0
        }
      },
      {
        position: {
          x: this.scale.width * 0.10,
          y: 420
        },
        moveDirection: {
          x: 1,
          y: 0
        }
      },
      {
        position: {
          x: this.scale.width * 0.90,
          y: 420
        },
        moveDirection: {
          x: -1,
          y: 0
        }
      },
    ]

    enemiesArr.forEach(e => {
      const enemy = this.enemies.get(e.position.x, e.position.y, 'enemy');
      if (!enemy) {
        return;
      }
      enemy.setScale(2);
      enemy.setMoveDirection(e.moveDirection);
      enemy.enableBody(true, e.position.x, e.position.y, true, true);
    });

  }
}