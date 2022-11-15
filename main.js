
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
    constructor(value, isDiscovered, isMarked) {
        this.value = value;
        this.isDiscovered = isDiscovered
        this.isMarked = isMarked
    }
}

class Position {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

//L'utilisateur choisis la difficulté
easyDifficultyButton.addEventListener('click', () => {
    difficulty = 7;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})
//L'utilisateur choisis la difficulté
normalDifficultyButton.addEventListener('click', () => {
    difficulty = 10;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})
//L'utilisateur choisis la difficulté
hardDifficultyButton.addEventListener('click', () => {
    difficulty = 15;
    tileArrayDisplay(difficulty);
    tileArrayHidden = createHiddenTileArray(difficulty);
    placeBombs(difficulty);
})

//Fonction qui affiche un nombre d'images de tuiles en fonction de la difficultée.
function tileArrayDisplay(difficulty) {
    
    ctx.canvas.width  = difficulty*45;
    ctx.canvas.height = difficulty*48;
    for (let x = 0; x < difficulty; x++) {
        for (let y = 0; y < difficulty; y++) {
        var imageTile = document.createElement("img");
        imageTile.src = "./image/tile.jpg";
        imageTile.addEventListener('load', function(){
            ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
        }, false);
        }

    }
}

//Fonction qui créée un tableau 7*7 ou 10*10 ou 15*15 en fonction de la difficultée choisie et l'initialise à 0 partout.
function createHiddenTileArray(difficulty) {
    
    var tileArrayHidden = new Array(difficulty)

    for (let i = 0; i < difficulty; i++){
        tileArrayHidden[i] = new Array(difficulty);
    }
    //On a créer un tableau vide.
    for(let i = 0; i < difficulty ; i++) {
        for(let j = 0; j < difficulty ; j++){
            tileArrayHidden[i][j] = new Tile(0,false,0);
        }
        //On a initialisé à 0.  
    } 
    console.log(tileArrayHidden);
    return tileArrayHidden;
   
}

//Fonction qui place le nombre 10 (qui représente les bombes) à un emplacement aléatoire dans le tableau. On répète l'opération en fonction de la difficultée.
function placeBombs(difficulty) {
    for (let i = 0; i < difficulty*2; i++){
        a = randomInt(difficulty-1);
        b = randomInt(difficulty-1);
        if(tileArrayHidden[a][b].value != 10){
            tileArrayHidden[a][b].value = 10;
        } else i--;
    }
    //console.log(tileArrayHidden);
}
//L'utilisateur fait un clique gauche sur une tuile
canvas.addEventListener('click', function(e) {
    var position = new Position
    position = getPosition(canvas, e);
    x = position.x
    y = position.y
    userLeftClickedOnTile(x,y)
})
//L'utilisateur fait un clique droit sur une tuile
canvas.addEventListener('contextmenu', function(e) {
    var position = new Position
    position = getPosition(canvas, e);
    x = position.x
    y = position.y
    userRightClickedOnTile(x,y)
    e.preventDefault();
})

function userLeftClickedOnTile(x,y){
    if(tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isDiscovered == false && tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isMarked == 0){
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

function userRightClickedOnTile(x,y){
    if(tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isDiscovered == false && tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isMarked == 0){
        var imageMarkedTile = document.createElement("img");
        imageMarkedTile.src = "./image/markedTile.jpg";
        imageMarkedTile.addEventListener('load', function(){
            ctx.drawImage(imageMarkedTile, Math.floor(x/45)*45, Math.floor(y/48)*48, 45, 48,);
        }, false);
        tileArrayHidden[Math.floor(x/45)][Math.floor(y/48)].isMarked = 1;
    }
}
function getPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let position = new Position;
    position.x = x
    position.y = y
    return position;

   
}

//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
function randomInt(max)
{
    return Math.floor(Math.random() * (max + 1));
}
