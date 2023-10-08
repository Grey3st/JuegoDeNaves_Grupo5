class Escena1 extends Phaser.Scene {

    constructor() {
        super({key:"Escena1"});
        this.platforms = null;
        this.scoreText = "";
        this.score = 0;

    }

    preload() {
        this.load.image('sky', '../public/img/sky.png');
        this.load.image('enemy', '../public/img/enemy.png');
        this.load.image('red', '../public/img/red.png');
        this.load.image('shoot', '../public/img/shoot.png');
        this.load.spritesheet('nave', '../public/img/nave.png', { frameWidth: 70, frameHeight: 62 });

        this.load.audio('gameMusic', '../public/sound/gamePlay.mp3');

    }

    create() {




        this.gameMusic = this.sound.add('gameMusic');
        this.gameMusic.play();

        this.add.image(400, 300, 'sky');



        //--------------------------------------------//
        // this.add.image(400, 300, 'star');    crea una estrella estatica en el escenario 
        this.player = this.physics.add.sprite(100, 100, 'nave');
        this.player.body.allowGravity=false;
        //-------------------------//
       // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //----/
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('nave', { start: 2, end: 2}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('nave', { start: 1, end: 1}),
            frameRate: 10,
            repeat: -1
        });

        // el jugador tiene colision con las plataformas 
        this.physics.add.collider(this.player, this.platforms);
        // se mueve con el teclado  el jugador
        this.cursors = this.input.keyboard.createCursorKeys();


this.enemys = this.physics.add.group();


        //Habilita las colisiones de las entrellas con la plataforma
       // this.physics.add.collider(this.stars, this.platforms);

        //Choque entre las estrellas y el jugador
       // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //Para controlar el puntaje
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //Para agregar las bombas
        //this.bombs = this.physics.add.group();
        //this.physics.add.collider(this.bombs, this.platforms);
        //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    }

    //------------------------//
    update() {

        let particles= this.add.particles(-10,0,'red',{

            speed:100,
            angle:{min:150,max:210},
            scale:{start:1,end:0},
            blendMode:'ADD'
        });

        particles.startFollow(this.player);





        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            //this.player.setVelocityY(0);
            //this.player.x-=10;
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.setVelocityX(0);
            //this.player.x-=10;
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
        }

        if (this.score==20){
            this.gameMusic.destroy();
            this.scene.start('Escena2');
            //this.scene.start('End',{puntaje:this.puntaje}); PARA LLEVAR EL PUNTAJE
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
        this.scene.start('FinDelJuego')   // llama a otra escena 

    }

}
export default Escena1;