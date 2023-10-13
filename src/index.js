import Escena1 from "./escenas/Escena1.js" // importar cada escena para poder utilizarla en el array
import Escena2 from "./escenas/Escena2.js";
import FinDelJuego from "./escenas/FinDelJuego.js"; // escena fin del juego al tocar bomba 
import InicioJuego from "./escenas/InicioJuego.js";
import Ganador from "./escenas/Ganador.js";//Escena cuando ganamos

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [InicioJuego,Escena1,Escena2,FinDelJuego,Ganador]      // cargar las escenas que se mostraran en el juego 
};

let game = new Phaser.Game(config);

