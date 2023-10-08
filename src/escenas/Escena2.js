
class Escena2 extends Phaser.Scene{
    
    constructor(){
        super({key:"Escena2"});
        this.platforms = null;
        this.scoreText = "";
        this.score = 0;
        
    }
    preload(){
        

        this.load.image('sky', '../public/img/sky.png');
        this.load.image('ground', '../public/img/platform.png');
        this.load.image('star', '../public/img/star.png');
        this.load.image('bomb', '../public/img/bomb.png');
        this.load.spritesheet('dude', '../public/img/dude.png', { frameWidth: 32, frameHeight: 48 });

        this.load.audio('lost', '../public/sound/gameOverMusic.mp3');
        this.load.audio('gameMusic', '../public/sound/gamePlay.mp3');
    }
    create(){
        
        this.gameMusic = this.sound.add('gameMusic');
        this.gameMusic.play();
        this.musicaLost = this.sound.add('lost');
        
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.plataforma1=this.platforms.create(600, 400, 'ground');
        this.plataforma2=this.platforms.create(50, 300, 'ground');
        this.plataforma3=this.platforms.create(750, 220, 'ground');
        
        
        
        
        //--------------------------------------------//
        //this.add.image(400, 300, 'star');    crea una estrella estatica en el escenario 
        this.player = this.physics.add.sprite(100, 100, 'dude');
        //-------------------------//
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //----/
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // el jugador tiene colision con las plataformas 
        this.physics.add.collider(this.player, this.platforms);
        // se mueve con el teclado  el jugador
        this.cursors = this.input.keyboard.createCursorKeys();

        // Se agregan las estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5, // Cantidad de estrellas
            setXY: { x: 0, y: 0, stepX:Phaser.Math.RND.between(70,150) } // Inicialmente, las posiciones X e Y no importan
        });

        // Luego, configuramos las posiciones aleatorias solo en el eje X
        this.stars.children.iterate(function (star) {
            star.x = Phaser.Math.RND.between(0, 600); // Posición X aleatoria
            star.y = 0; // Mantenemos la misma posición Y en 0
            star.stepX = Phaser.Math.RND.between(70, 150); // Espaciado X aleatorio
        });

        //Se agrega el rebote entre el grupo de estrelas
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        //Habilita las colisiones de las entrellas con la plataforma
        this.physics.add.collider(this.stars, this.platforms);

        //Choque entre las estrellas y el jugador
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //Para controlar el puntaje
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //Para agregar las bombas
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        console.log("Cambio Escena2");
        
    }
    update(){
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
        
        this.plataforma1.x-=2;
        this.plataforma1.body.x-=2;
        if (this.plataforma1.body.x<=-250 && this.plataforma1.x <=-250) {
            this.plataforma1=this.platforms.create(900, 400, 'ground');
        }

        this.plataforma2.x+=5;
        this.plataforma2.body.x+=5;
        if (this.plataforma2.body.x>=800) {
            this.plataforma2=this.platforms.create(-150, 300, 'ground');
        }

        this.plataforma3.x-=2;
        this.plataforma3.body.x-=2;
        if (this.plataforma3.body.x<=-400) {
            this.plataforma3=this.platforms.create(1000, 220, 'ground');
        }
       
    }
    //Colisión entre el jugador y las estrellas
    collectStar(player, star) {
        star.disableBody(true, true);
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
        }
        
    }


    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameMusic.destroy();
        this.musicaLost.play();
        this.scene.start('FinDelJuego')   // llama a otra escena 
    }
}

export default Escena2;
