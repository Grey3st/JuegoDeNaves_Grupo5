
class Escena2 extends Phaser.Scene{
    
    constructor() {
        super({ key: "Escena2" });
        this.platforms = null;
        this.scoreText = "";
        this.score = 0;

        this.vidaText = "";
        this.vida = 50; //empieza con menos vida
    }

    preload() {
        this.load.image('sky', '../public/img/sky.png');
        this.load.image('enemy', '../public/img/enemy.png');
        this.load.image('red', '../public/img/red.png');
        this.load.image('shoot', '../public/img/shoot.png');
        this.load.image('disparo', '../public/img/disparo.png')
        this.load.spritesheet('nave', '../public/img/nave.png', { frameWidth: 70, frameHeight: 62 });
        this.load.audio('gameMusic', '../public/sound/gamePlay.mp3');

    }

    create() {

        // crea el disparo 
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.shoot();  // llama al disparo al apretar la barra espaciadora 
            }
        });



        this.gameMusic = this.sound.add('gameMusic');
        this.gameMusic.play();

        this.add.image(400, 300, 'sky');
        this.player = this.physics.add.sprite(100, 100, 'nave');
        this.player.body.allowGravity = false;
        
 
        this.time.addEvent({
            delay:3000,
            callback:this.crearEnemigos,
            callbackScope:this,
            repeat:-1
        });
        

      
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('nave', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('nave', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

      
        // se mueve con el teclado  el jugador
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //se crea el puntaje 
        this.vidaText = this.add.text(16,50,'Vida: 50',{fontSize : '32px',fill: '#000'});
        
    }

    //------------------------//
    update() {

        let particles = this.add.particles(-10, 0, 'red', {

            speed: 100,
            angle: { min: 150, max: 210 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        particles.startFollow(this.player);

        //4 direcciones de la nave

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.setVelocityX(0);
            this.player.anims.play('up', true);
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.setVelocityX(0);
            this.player.anims.play('down', true);
        }
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(0);
            this.player.anims.play('left', true);
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setVelocityY(0);
            this.player.anims.play('right', true);
        }
        //4 diagonales de la nave
        if (this.cursors.up.isDown && (this.cursors.right.isDown || this.cursors.left.isDown)) {
            this.player.setVelocityY(-160);
            this.player.anims.play('up', true);
        }
        if (this.cursors.down.isDown && (this.cursors.right.isDown || this.cursors.left.isDown)) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
        }

        //si pierde todas las vidas
        if (this.vida == 0) {
            this.gameMusic.destroy();
            this.scene.start('FinDelJuego');
            //this.scene.start('End',{puntaje:this.puntaje}); PARA LLEVAR EL PUNTAJE
        }
        
        
    }

    crearEnemigos(){

        if (!this.enemiesGroup) {
            this.enemiesGroup = this.physics.add.group();
        }
    
        // Creamos enemigos
        for (let i = 0; i < 12; i++) {
            let enemyX = Phaser.Math.Between(650, 750);
            let enemyY = Phaser.Math.Between(25, 550);
    
            let enemy = this.enemiesGroup.create(enemyX, enemyY, 'enemy');
            enemy.setVelocityX(-70);
    
            // Establecemos las colisiones y eventos para cada enemigo
            this.physics.add.overlap(this.player, enemy, this.ColisionEnemy, null, this);
    
            enemy.checkWorldBounds = true;
            // Hace que el enemigo se destruya cuando sale de la pantalla
            enemy.outOfBoundsKill = true; 
        }
       
    }

    //Colisión entre el jugador y las naves
    ColisionEnemy(player,enemy) {

        console.log("colision");
        /*al detectar colision entre player y enemy, desaparecen enemy */
        enemy.disableBody(true,true);
        this.vida -= 10;
        this.vidaText.setText('Vida: ' + this.vida);
        /*star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);*/

    }

    //Colisión entre la bala y el enemigo
    ColisionEnemyBala(bala,enemy) {

        console.log("colision bala");
        /*al detectar colision entre la bala y el enemigo, desaparecen enemy */
        enemy.disableBody(true,true);
        /*
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
            */
    }

    

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.scene.start('FinDelJuego')   // llama a otra escena 
    }



    // funcion de disparo 

    shoot() {

        let bala = this.physics.add.sprite(this.player.x, this.player.y, 'disparo')

        let velocidadBala = 300;
        bala.setScale(0.05);

        bala.setVelocity(velocidadBala, 0);

        bala.setCollideWorldBounds(false);

    }

}
export default Escena2;
