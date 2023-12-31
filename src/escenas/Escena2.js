class Escena2 extends Phaser.Scene {

    constructor() {
        super({ key: "Escena2" });
        this.platforms = null;
        this.scoreText = "";
        this.score = 200;
        this.vidaText = "";
        this.vida = 100;
    }
    init(data){
        this.score = data.score;
    }
    preload() {
        this.load.image('sky2', '../public/img/sky2.png'); 
        this.load.image('enemy', '../public/img/enemy.png');
        this.load.image('red', '../public/img/red.png');
        this.load.image('shoot', '../public/img/shoot.png');
        this.load.image('disparo', '../public/img/disparo.png')
        this.load.spritesheet('nave', '../public/img/nave.png', { frameWidth: 70, frameHeight: 62 });
        this.load.audio('gameMusic2', '../public/sound/gamePlay2.mp3');

    }

    create() {

        // crea el disparo 
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.shoot();  // llama al disparo al apretar la barra espaciadora 
            }
        });

    
        this.gameMusic2 = this.sound.add('gameMusic2');
        this.gameMusic2.play();

        this.add.image(400, 300, 'sky2');
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
            delay:2000,
            callback:this.crearEnemigos,
            callbackScope:this,
            repeat:-1
        });

        this.time.addEvent({
            delay:3000,
            callback:this.crearBalas,
            callbackScope:this,
            repeat:-1
        });
        
        this.createParticulas();


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
        this.scoreText = this.add.text(16, 16, 'score: '+ this.score, { fontSize: '32px', fill: '#FFF' });
        //se crea el puntaje 
        this.vidaText = this.add.text(16,50,'Vida: 100',{fontSize : '32px',fill: '#FFF'});
        //Para agregar las bombas
        //this.bombs = this.physics.add.group();
        //this.physics.add.collider(this.bombs, this.platforms);
        //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        
        

        
    }

    //------------------------//
    update() {

        //si llega a puntaje 1000 pasa de nivel
       if (this.score == 500) {
            this.scene.start('Ganador');
            this.scene.start('Ganador',{score:this.score});
            this.gameMusic2.destroy();
            console.log("cambio escena");
       } 

                //si pierde todas las vidas
                if (this.vida == 0) {
            
                    this.scene.start('FinDelJuego');
                    this.gameMusic2.destroy();
                    console.log("game over");
                    //this.scene.start('End',{puntaje:this.puntaje}); PARA LLEVAR EL PUNTAJE
                }

      //  let particles = this.add.particles(-10, 0, 'red', {

        //    speed: 100,
          //  angle: { min: 150, max: 210 },
           // scale: { start: 1, end: 0 },
           // blendMode: 'ADD'
        //});

        //particles.startFollow(this.player);

        //4 direcciones de la nave

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.setVelocityX(0);
            this.player.anims.play('up', true);
        }
        else if(this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.setVelocityX(0);
            this.player.anims.play('down', true);
        }else{              //evita que se mueva al dejar de presionar la tecla correspondiente 
 
            this.player.setVelocityY(0);
        }
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(0);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setVelocityY(0);
            this.player.anims.play('right', true);
        }else{
                  this.player.setVelocityX(0)

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

        
    }

    crearEnemigos(){
        let enemy;
        if (!this.enemiesGroup) {
            this.enemiesGroup = this.physics.add.group();
        }
        let velocidad = -200;
        // Creamos enemigos
        for (let i = 0; i < 15; i++) {
            let enemyX = Phaser.Math.Between(800, 1100);
            let enemyY = Phaser.Math.Between(25, 550);
            
            /**variables para dar efecto que se mueven los enemigos */
            let velocidadX = Phaser.Math.Between(-50, -200);//-200; 
            let velocidadY = Phaser.Math.Between(-50, 50);

            enemy = this.enemiesGroup.create(enemyX, enemyY, 'enemy');
            
            /**le damos a enemy la velocidad con las variables anteriores */
            enemy.setVelocity(velocidadX, velocidadY);

            for (let j = 0; j < 3; j++) {
                enemy.setVelocityX(velocidad);
                velocidad -=10;
            }
            
    
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
        this.scoreText.setText('Score: ' + this.score);*/

    }


    // funcion de disparo 
    //faltaria agregar la funcion de colision entre bala y enemigo
    shoot() {
        
        if (!this.balaGroup) {
            this.balaGroup=this.physics.add.group();
        }
        
        let bala = this.balaGroup.create(this.player.x, this.player.y, 'disparo')

        let velocidadBala = 300;
        bala.setScale(0.05);

        bala.setVelocity(velocidadBala, 0);

        //bala.setCollideWorldBounds(false);
        //this.physics.add.overlap(bala, this.enemiesGroup, this.ColisionEnemyBala, null, this);

        this.physics.add.overlap(bala, this.enemiesGroup, this.ColisionEnemyBala, null, this)
        //console.log("Disparo realizado");
        
        
    
    }
    //Colisión entre la bala y el enemigo
    ColisionEnemyBala(bala,enemy) {
        
    // detecta colision bala enemigo y elimina bala
    bala.disableBody(true, true);

    // detecta colision bala enemigo y elimina enemy
    enemy.disableBody(true, true);

    // elimina un enemigo de enemiesGroup
    this.enemiesGroup.remove(enemy);
        console.log("colision2");
        this.score += 10;
        //this.enemiesGroup.disableBody(true, true);
        
        

        
        /*al detectar colision entre la bala y el enemigo, desaparecen enemy */
        //enemy.disableBody(true,true);


        //enemy.checkWorldBounds = true;
        // Hace que el enemigo se destruya cuando sale de la pantalla
        //enemy.outOfBoundsKill = true; 

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
    }

    crearBalas(){
        let enemyShoot;
        if (!this.enemiesShootGroup) {
            this.enemiesShootGroup = this.physics.add.group();
        }
    
        // Creamos balas
        for (let i = 0; i < 15; i++) {
            let enemyShootX = Phaser.Math.Between(900, 1100);
            let enemyShootY = Phaser.Math.Between(25, 550);
    
            enemyShoot = this.enemiesShootGroup.create(enemyShootX, enemyShootY, 'shootEnemy');
            enemyShoot.setVelocityX(-300);
    
            // Establecemos las colisiones y eventos para cada enemigo
            this.physics.add.overlap(this.player, enemyShoot, this.ColisionEnemyShoot, null, this);
    
            enemyShoot.checkWorldBounds = true;
            // Hace que el enemigo se destruya cuando sale de la pantalla
            enemyShoot.outOfBoundsKill = true; 
        }

       
    }

    //Colisión entre el jugador y las estrellas
    ColisionEnemyShoot(player,enemyShoot) {

        console.log("colision");
        /*al detectar colision entre player y enemy, desaparecen enemy */
        enemyShoot.disableBody(true,true);
        this.vida -= 10;
        this.vidaText.setText('Vida: ' + this.vida);
        /*star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);*/

    }


    createParticulas(){
        let particles = this.add.particles(-10, 0, 'red', {

            speed: 100,
            angle: { min: 50, max: 280 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            callback:this.createParticulas,
            callbackScope:this,
            /*speed: 100,
            angle: { min: 150, max: 210 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'*/
        });

        particles.startFollow(this.player);
    }

}
export default Escena2;
