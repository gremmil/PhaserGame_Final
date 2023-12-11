import Phaser from 'phaser';

export default class HUDScene extends Phaser.Scene {
  private livesText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private lives: number;
  private score: number;
  private emitter: Phaser.Events.EventEmitter;

  constructor() {
    super({ key: 'HUDScene' });
    this.lives = 0; // Inicializar las vidas del jugador
    this.score = 0; // Inicializar el puntaje del jugador
    this.emitter = new Phaser.Events.EventEmitter();
  }

  create() {
    // Mostrar el contador de vidas
    this.livesText = this.add.text(10, 10, `Vidas: ${this.lives}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });

    // Mostrar el puntaje
    this.scoreText = this.add.text(10, 50, `Puntaje: ${this.score}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });

    // Suscribirse a eventos para actualizar el HUD
    this.emitter.on('updateLives', this.updateLives, this);
    this.emitter.on('updateScore', this.updateScore, this);

    // Actualizar el HUD con los valores iniciales
    this.updateHUD();
  }

  updateHUD() {
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.scoreText.setText(`Puntaje: ${this.score}`);
  }

  updateLives(value: number) {
    this.lives += value;
    this.updateHUD();
  }

  updateScore(value: number) {
    this.score = value;
    this.updateHUD();
  }

  getEmitter() {
    return this.emitter;
  }
}