export default class Popup extends Phaser.GameObjects.Container {
  private continueButton: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, title: string, body: string) {
    super(scene, x, y);

    const popupWidth = Math.max(Number(scene.sys.game.config.width) - 100, 300);

    // Crear el fondo del popup
    const popupBackground = scene.add.rectangle(0, 0, popupWidth, 200, 0xffffff);
    this.add(popupBackground);

    // Crear el título del popup
    const titleText = scene.add.text(0, -70, title, { fontSize: '24px', color: '#000000' });
    titleText.setOrigin(0.5);
    this.add(titleText);

    // Crear el cuerpo del popup
    const bodyText = scene.add.text(0, 0, body, { fontSize: '18px', color: '#000000', wordWrap: { width: popupWidth - 50 } });
    bodyText.setOrigin(0.5);
    this.add(bodyText);

    // Crear el botón del popup
    this.continueButton = scene.add.rectangle(0, 70, 100, 40, 0xff0000);
    this.continueButton.setInteractive();
    this.add(this.continueButton);

    // Agregar texto "Continuar" al botón
    const buttonText = scene.add.text(0, 70, 'Continuar', { fontSize: '18px', color: '#ffffff' });
    buttonText.setOrigin(0.5);
    this.add(buttonText);

    // Agregar evento 'pointerdown' al botón
    this.continueButton.on('pointerdown', () => {
      this.emit('buttonPressed');
    });

    scene.add.existing(this);
  }

  getContinueButton(): Phaser.GameObjects.Rectangle {
    return this.continueButton;
  }
}