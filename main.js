
const easyDifficultyButton = document.getElementById('easyDifficultyButton');
const normalDifficultyButton = document.getElementById('normalDifficultyButton');
const hardDifficultyButton = document.getElementById('hardDifficultyButton');

let difficulty = 0;
var tileArrayHidden;
const canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d');


class Tile {
    value = 0;
    isDiscovered = false;
    constructor(value, isDiscovered) {
        this.value = value;
        this.isDiscovered = isDiscovered
    }
}

canvas.addEventListener('mousedown', function(e) {
    userClickedOnTile(canvas, e)
})

easyDifficultyButton.addEventListener('click', () => {
    difficulty = 7;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})

normalDifficultyButton.addEventListener('click', () => {
    difficulty = 10;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})

hardDifficultyButton.addEventListener('click', () => {
    difficulty = 15;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})

function tileArrayDisplay(difficulty) {
    //Fonction qui affiche un nombre d'images de tuiles en fonction de la difficultée.
    ctx.canvas.width  = difficulty*45;
    ctx.canvas.height = difficulty*48;
    for (let x = 0; x < difficulty; x++) {
        for (let y = 0; y < difficulty; y++) {
        var imageTile = document.createElement("img");
        imageTile.src = "./image/tuile.jpg";
        imageTile.addEventListener('load', function(){
            ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
        }, false);
        }

    }
}

function createHiddenTileArray(difficulty) {
    //Fonction qui créée un tableau 7*7 ou 10*10 ou 15*15 en fonction de la difficultée choisie et l'initialise à 0 partout.
    var tileArrayHidden = new Array(difficulty)

    for (let i = 0; i < difficulty; i++){
        tileArrayHidden[i] = new Array(difficulty);
    }
    //On a créer un tableau vide.
    for(let i = 0; i < difficulty ; i++) {
        for(let j = 0; j < difficulty ; j++){
            tileArrayHidden[i][j] = new Tile(0,false);
        }
        //On a initialisé à 0.  
    } 
    console.log(tileArrayHidden);
    return tileArrayHidden;
   
}

function placeBombs(difficulty) {

    //On place le nombre 10 (qui représente les bombes) à un emplacement aléatoire dans le tableau. On répète l'opération en fonction de la difficultée.
    for (let i = 0; i < difficulty*2; i++){
        a = randomInt(difficulty-1);
        b = randomInt(difficulty-1);
        if(tileArrayHidden[a][b].value != 10){
            tileArrayHidden[a][b].value = 10;
        } else i--;
    }
    //console.log(tileArrayHidden);
}

function userClickedOnTile(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if(tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isDiscovered == false){
        var imageTile = document.createElement("img");
        imageTile.src = "./image/bombTile.jpg";
        var imageDiscoveredTile = document.createElement("img");
        imageDiscoveredTile.src = "./image/discoveredTile.jpg";

        if(tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].value == 10){
                imageTile.addEventListener('load', function(){
                ctx.drawImage(imageTile, Math.floor(x/45)*45, Math.floor(y/48)*48, 45, 48,);
                }, false);
                console.log("perdu");
        } 
        else {
            imageTile.addEventListener('load', function(){
            ctx.drawImage(imageDiscoveredTile, Math.floor(x/45)*45, Math.floor(y/48)*48, 45, 48,);
            }, false);
        }
        tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isDiscovered = true;
    }
}

function randomInt(max)
//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
{
    return Math.floor(Math.random() * (max + 1));
}
