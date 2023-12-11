import Phaser from 'phaser';
import Bullet from '../objects/Bullet';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Popup from '../shared/Popup';
import HUDScene from './HUDScene';
import { MoveDirectionI, MoveRangenI } from '../interfaces/general.interface';

export default class Level3Scene extends Phaser.Scene {
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
    super('Level3Scene');
    this.score = 0;
    this.lives = 3;
  }

  preload() {
    this.load.image("background_lvl3", 'img/backgrounds/lvl3.jpg');
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
    this.background = this.add.tileSprite(0, 0, 0, 0, "background_lvl3");
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
    this.player.setPosition(this.scale.width * 0.5, this.scale.height * 0.9)
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
          '¡Felicidades!, Completaste el juego!. ¿Deseas jugar de nuevo?');

        const continueButton = popup.getContinueButton();
        continueButton.on('pointerdown', () => {
          this.scene.start('TitleScene');
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
    const platformTopLeft = platforms.create(this.scale.width * 0.10, 180, 'platform');
    platformTopLeft.setSize(this.scale.width * 0.20, 10);
    platformTopLeft.setDisplaySize(this.scale.width * 0.20, 10);

    const platformTopRight = platforms.create(this.scale.width * 0.9, 180, 'platform');
    platformTopRight.setSize(this.scale.width * 0.2, 10);
    platformTopRight.setDisplaySize(this.scale.width * 0.2, 10);

    const platformTopMiddle = platforms.create(this.scale.width * 0.50, 180, 'platform');
    platformTopMiddle.setSize(this.scale.width * 0.30, 10);
    platformTopMiddle.setDisplaySize(this.scale.width * 0.30, 10);

    // Plataformas inferiores
    const platformLeft = platforms.create(this.scale.width * 0.05, 330, 'platform');
    platformLeft.setSize(this.scale.width * 0.1, 10);
    platformLeft.setDisplaySize(this.scale.width * 0.1, 10);

    const platformRight = platforms.create(this.scale.width * 0.965, 340, 'platform');
    platformRight.setSize(this.scale.width * 0.065, 10);
    platformRight.setDisplaySize(this.scale.width * 0.065, 10);

    // Plataforma del medio
    const platformMiddle1 = platforms.create(this.scale.width * 0.65, 350, 'platform');
    platformMiddle1.setSize(this.scale.width * 0.30, 10);
    platformMiddle1.setDisplaySize(this.scale.width * 0.30, 10);

    const platformMiddle2 = platforms.create(this.scale.width * 0.30, 350, 'platform');
    platformMiddle2.setSize(this.scale.width * 0.15, 10);
    platformMiddle2.setDisplaySize(this.scale.width * 0.15, 10);


    // Agregar las plataformas al grupo de plataformas
    platforms.add(platformTopLeft);
    platforms.add(platformTopRight);
    platforms.add(platformTopMiddle);
    platforms.add(platformLeft);
    platforms.add(platformRight);
    platforms.add(platformMiddle1);
    platforms.add(platformMiddle2);

    platforms.setAlpha(0);
    // Establecer colisión entre el jugador y las plataformas
    this.physics.add.collider(this.player, platforms);
  }
  private createNPCEnemies() {

    const enemiesArr: Array<{ position: { x: number, y: number }, moveDirection: MoveDirectionI, moveRange?: MoveRangenI }> = [
      {
        position: {
          x: this.scale.width * 0.10,
          y: 150
        },
        moveDirection: {
          x: 1,
          y: 0
        },
        moveRange: {
          max: {
            x: this.scale.width * 0.20,
            y: 150
          },
          min: {
            x: 0,
            y: 130
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.50,
          y: 150
        },
        moveDirection: {
          x: -1,
          y: 0
        },
        moveRange: {
          max: {
            x: this.scale.width * 0.60,
            y: 150
          },
          min: {
            x: this.scale.width * 0.40,
            y: 130
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.90,
          y: 150
        },
        moveDirection: {
          x: -1,
          y: 0
        },
        moveRange: {
          max: {
            x: this.scale.width,
            y: 150
          },
          min: {
            x: this.scale.width * 0.80,
            y: 130
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.30,
          y: 320
        },
        moveDirection: {
          x: 1,
          y: 0
        },
        moveRange: {
          max: {
            x: this.scale.width * 0.35,
            y: 320
          },
          min: {
            x: this.scale.width * 0.25,
            y: 300
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.70,
          y: 320
        },
        moveDirection: {
          x: -1,
          y: 0
        },
        moveRange: {
          max: {
            x: this.scale.width * 0.80,
            y: 320
          },
          min: {
            x: this.scale.width * 0.60,
            y: 300
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.25,
          y: this.scale.height * 0.90
        },
        moveDirection: {
          x: 1,
          y: -1
        },
        moveRange: {
          max: {
            x: this.scale.width * 0.40,
            y: this.scale.height
          },
          min: {
            x: 0,
            y: this.scale.height * 0.80
          }
        }
      },
      {
        position: {
          x: this.scale.width * 0.75,
          y: this.scale.height * 0.90
        },
        moveDirection: {
          x: -1,
          y: 1
        },
        moveRange: {
          max: {
            x: this.scale.width,
            y: this.scale.height
          },
          min: {
            x: this.scale.width * 0.60,
            y: this.scale.height * 0.80
          }
        }
      },
    ]

    enemiesArr.forEach(e => {
      const enemy: Enemy = this.enemies.get(e.position.x, e.position.y, 'enemy');
      if (!enemy) {
        return;
      }
      enemy.setScale(2);
      enemy.setMoveDirection(e.moveDirection);
      if (e.moveRange) {
        enemy.setMoveRange(e.moveRange)
      }
      enemy.enableBody(true, e.position.x, e.position.y, true, true);
    });

  }
}