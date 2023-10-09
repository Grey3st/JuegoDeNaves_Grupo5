class Escena1 extends Phaser.Scene {

    constructor() {
        super({ key: "Escena1" });
        this.platforms = null;
        this.scoreText = "";
        this.score = 0;

        this.vidaText = "";
        this.vida = 100;
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
        //--------------------------------------------//
        // this.add.image(400, 300, 'star');    crea una estrella estatica en el escenario 
        this.player = this.physics.add.sprite(100, 100, 'nave');
        this.player.body.allowGravity = false;
        //-------------------------//
        
        //this.enemy=this.physics.add.staticGroup();
        //this.enemy.create(258,250,'enemy')
        //this.enemy=this.physics.add.image(600,300,"enemy");

        /*Metodo para repetir eventos */
        //this.crearEnemigos();
        this.time.addEvent({
            delay:3000,
            callback:this.crearEnemigos,
            callbackScope:this,
            repeat:-1
        });
        

        //this.enemy = this.physics.add.group();
        //this.physics.add.collider(this.player, this.enemy);
        //this.physics.add.collider(this.player, this.enemy, this.collectStar, null, this);
        //this.physics.add.overlap(this.player, this.enemy, this.collectStar, null, this);
        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //----/
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

        // el jugador tiene colision con las plataformas 
        this.physics.add.collider(this.player, this.platforms);
        // se mueve con el teclado  el jugador
        this.cursors = this.input.keyboard.createCursorKeys();


        //this.enemys = this.physics.add.group();
        //Habilita las colisiones de las entrellas con la plataforma
        //this.physics.add.collider(this.stars, this.enemy);

        

        //Para controlar el puntaje
        //this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //se crea el puntaje 
        this.vidaText = this.add.text(16,50,'Vida: 100',{fontSize : '32px',fill: '#000'});
        //Para agregar las bombas
        //this.bombs = this.physics.add.group();
        //this.physics.add.collider(this.bombs, this.platforms);
        //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        
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

        if (this.score == 20) {
            this.gameMusic.destroy();
            this.scene.start('Escena2');
            //this.scene.start('End',{puntaje:this.puntaje}); PARA LLEVAR EL PUNTAJE
        }
        
        
    }

    crearEnemigos(){

        if (!this.enemiesGroup) {
            this.enemiesGroup = this.physics.add.group();
        }
    
        // Creamos enemigos
        for (let i = 0; i < 10; i++) {
            let enemyX = Phaser.Math.Between(650, 750);
            let enemyY = Phaser.Math.Between(25, 550);
    
            let enemy = this.enemiesGroup.create(enemyX, enemyY, 'enemy');
            enemy.setVelocityX(-100);
    
            // Establecemos las colisiones y eventos para cada enemigo
            this.physics.add.overlap(this.player, enemy, this.ColisionEnemy, null, this);
    
            enemy.checkWorldBounds = true;
            // Hace que el enemigo se destruya cuando sale de la pantalla
            enemy.outOfBoundsKill = true; 
        }
       
    }

    //Colisión entre el jugador y las estrellas
    ColisionEnemy(player,enemy) {

        console.log("colision");
        /*al detectar colision entre player y enemy, desaparecen enemy */
        enemy.disableBody(true,true);
        this.vida -= 10;
        this.vidaText.setText('Vida: ' + this.vida);
        /*star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        //Para las bombas
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
            let bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }*/
    }

    

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.scene.start('FinDelJuego')   // llama a otra escena 

    }

   //colision entre el jugador y el enemigo 
    hitEnemy(player,enemy){
        this.vida -=10;
        this.vida.setText('vida:'+ this.vida);
    }


    // funcion de disparo 

    shoot() {

        let bala = this.physics.add.sprite(this.player.x, this.player.y, 'disparo')

        let velocidadBala = 300;
        bala.setScale(0.05);

        bala.setVelocity(velocidadBala, 0);

        bala.setCollideWorldBounds(false)

    }

}
export default Escena1;