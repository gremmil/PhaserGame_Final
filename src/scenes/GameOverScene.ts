import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  private restartButton: Phaser.GameObjects.Text;
  public background: Phaser.GameObjects.TileSprite;

  constructor() {
    super('GameOverScene');
  }
  preload() {
    this.load.image('background_gameover', 'img/backgrounds/gameover.png');
  }
  create() {
    const { width, height } = this.scale;
    this.background = this.add.tileSprite(0, 0, 0, 0, "background_gameover");
    this.background.setPosition(this.game.canvas.width / 2, this.game.canvas.height / 2);
    this.background.setScale(0.5); // Ajusta la escala si es necesario
    // Asegurarse de que el tileSprite se muestre completo
    this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
    // Mostrar el mensaje de fin de juego
    const gameOverText = this.add.text(width * 0.5, height * 0.4, 'Game Over', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#000'
    });
    gameOverText.setOrigin(0.5);

    // Mostrar el botón de reinicio
    this.restartButton = this.add.text(width * 0.5, height * 0.6, 'Restart', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#000'
    });
    this.restartButton.setOrigin(0.5);
    this.restartButton.setInteractive();

    // Reiniciar el juego al hacer clic en el botón de reinicio
    this.restartButton.on('pointerdown', () => {
      this.scene.start('TitleScene');
    });
  }
}