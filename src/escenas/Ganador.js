class Ganador extends Phaser.Scene {

    constructor() {
        super({ key: 'Ganador' })
    }
    preload() {
        this.load.image('congrats', "../public/img/congrats.png")
        this.load.audio('congratulationMusic', '../public/sound/congratulationMusic.mp3');
        //this.load.image('fin', "../public/img/finJuego.png")
        //this.load.audio('gameOver', '../public/sound/gameOverMusic.mp3');
    }

    create() {
        /*this.gameOver = this.sound.add('gameOver');
        this.gameOver.play();*/
        this.gameMusic = this.sound.add('congratulationMusic');
        this.gameMusic.play();
        //let fondo = this.add.image(0, 0, 'congrats');
        //fondo.setOrigin(0, 0);
        //--------//
        let centerX = this.cameras.main.width / 2;
        let centerY = this.cameras.main.height / 2;
        //---//
        let fin = this.add.image(centerX, centerY, 'congrats');
        fin.setScale(1.2)
    }

}
export default Ganador;