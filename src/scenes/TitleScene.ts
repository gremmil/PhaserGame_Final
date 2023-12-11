import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  private startButton: Phaser.GameObjects.Text;
  public background: Phaser.GameObjects.TileSprite;

  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('background_title', 'img/backgrounds/title.jpg');
  }
  create() {
    const { width, height } = this.scale;
    this.background = this.add.tileSprite(0, 0, 0, 0, "background_title");
    this.background.setPosition(this.game.canvas.width / 2, this.game.canvas.height / 2);
    this.background.setScale(0.5); // Ajusta la escala si es necesario
    // Asegurarse de que el tileSprite se muestre completo
    this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);

    // Mostrar el nombre del juego y el autor
    const gameTitle = this.add.text(width * 0.5, height * 0.4, 'Clean River', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    gameTitle.setOrigin(0.5);

    const authorText = this.add.text(width * 0.5, height * 0.5, 'Author: Miguel Angel Huanacchiri Castillo', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    authorText.setOrigin(0.5);

    // Crear el botón de inicio
    this.startButton = this.add.text(width * 0.5, height * 0.6, 'Start', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    this.startButton.setOrigin(0.5);
    this.startButton.setInteractive();

    // Redirigir a la escena Level1Scene al hacer clic en el botón de inicio
    this.startButton.on('pointerdown', () => {
      this.scene.launch('HUDScene').bringToTop('HUDScene');
      this.scene.start('Level1Scene');
    });
  }
}