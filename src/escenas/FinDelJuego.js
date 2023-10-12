class FinDelJuego extends Phaser.Scene {

    constructor() {
        super({ key: 'FinDelJuego' })
    }
    preload() {
        this.load.image('fondo', "../public/img/fondoInicio.png")
        this.load.image('fin', "../public/img/finJuego.png")
        this.load.audio('gameOver', '../public/sound/gameOverMusic.mp3');
    }

    create() {
        this.gameOver = this.sound.add('gameOver');
        this.gameOver.play();
        let fondo = this.add.image(0, 0, 'fondo');
        fondo.setOrigin(0, 0);
        //--------//
        let centerX = this.cameras.main.width / 2;
        let centerY = this.cameras.main.height / 2;
        //---//
        let fin = this.add.image(centerX, centerY, 'fin');
        fin.setScale(0.2)
    }

}
export default FinDelJuego;