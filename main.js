
const easyDifficultyButton = document.getElementById('easyDifficultyButton');
const normalDifficultyButton = document.getElementById('normalDifficultyButton');
const hardDifficultyButton = document.getElementById('hardDifficultyButton');
const tryAgainButton = document.getElementById('retryButton');
const playerWonDiv = document.getElementById('playerWin');
const canvas = document.querySelector('canvas')
var didPlayerLost = false;
var hiddenTileArray;
let gameSize = 0;
var difficulty = "easy"
let bombsNumber = 0;
let tileDiscovered = 0;
let tileToDiscover = 0;
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

//Au démarrage, on lance un démineur facile par défaut
document.addEventListener('DOMContentLoaded', function() {
    start();
});

//L'utilisateur choisis la difficulté facile
easyDifficultyButton.addEventListener('click', () => {
    difficulty = "easy"
    start();
})

//L'utilisateur choisis la difficulté moyenne
normalDifficultyButton.addEventListener('click', () => {
    difficulty = "normal"
    start();
})

//L'utilisateur choisis la difficulté difficile
hardDifficultyButton.addEventListener('click', () => {
    difficulty = "hard"
    start();
})

tryAgainButton.addEventListener('click', () =>{
    start();
})

playerWonDiv.addEventListener('click', () =>{
    start();
})

//Cette fonction lancer la partie en fonction des parametres
  function start() {

    switch (difficulty){
        case "easy":     
            gameSize = 8;
            break;
        case "normal":
            gameSize = 12;
            break;
        case "hard":
            gameSize = 16;
            break;
    }

    didPlayerLost = false;
    bombsNumber = gameSize*(gameSize/8);
    tileToDiscover = gameSize*gameSize - bombsNumber;
    tileDiscovered = 0;
    tryAgainButton.style.display = "none";
    playerWonDiv.style.display = "none";
    hiddenTileArray = createHiddenTileArray();
    displayTiles();
    placeBombs();
    setTilesNumber();
}

//L'utilisateur fait un clic gauche sur une tuile, on envoie la position du clic
canvas.addEventListener('click', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = Math.floor(position.x/45);
    y = Math.floor(position.y/48);
    userLeftClickedOnTile(x,y);
})

//L'utilisateur fait un clic droit sur une tuile, on envoie la position du clic
canvas.addEventListener('contextmenu', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = Math.floor(position.x/45);
    y = Math.floor(position.y/48);
    userRightClickedOnTile(x,y);
    e.preventDefault();

})

//Fonction qui va découvrir la tuile, si elle ne l'est pas déjà, et si elle n'est pas marquée (drapeau ou '?').
function userLeftClickedOnTile(x,y){

    if(hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 0 && didPlayerLost == false){
        hiddenTileArray[x][y].isDiscovered = true;
        if(hiddenTileArray[x][y].value >= 10){
                playerLost();
                var imageBombOnClick = document.createElement("img");
                imageBombOnClick.src = "./image/bombOnClick.png";
                imageBombOnClick.addEventListener('load', function(){
                    ctx.drawImage(imageBombOnClick, x*45, y*48, 45, 48,);
                    }, false);
        } 
        else {
            var imageDiscoveredTile = document.createElement("img");
            imageDiscoveredTile.src = "./image/discoveredTile.jpg";
            imageDiscoveredTile.addEventListener('load', function(){
            ctx.drawImage(imageDiscoveredTile, x*45, y*48, 45, 48,);
            let value = hiddenTileArray[x][y].value;
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            if(value != 0){
            ctx.fillText(value, x*45+22.5,y*48+24);
            }
            }, false);
            tileDiscovered++;
            if(tileDiscovered == tileToDiscover && bombsNumber == 0){
                playerWon();
        }

        if(hiddenTileArray[x][y].value == 0) {
             tileIsSetToZero(x,y)
        }
        
    }
}
}

function tileIsSetToZero(x,y) {

    if(x+1 <= gameSize-1) {
        userLeftClickedOnTile(x+1,y);
    }
        
    if(x+1 <= gameSize-1 && y+1 <= gameSize-1) {
        userLeftClickedOnTile(x+1,y+1);
    }
        
    if(x+1 <= gameSize-1 && y-1 >= 0) {
        userLeftClickedOnTile(x+1,y-1);
    }
        
    if(x-1 >= 0) {
        userLeftClickedOnTile(x-1,y);
    }
        
    if(x-1 >= 0 && y-1 >= 0){
        userLeftClickedOnTile(x-1,y-1);
    }
        
    if(x-1 >= 0 && y+1 <= gameSize-1) {
        userLeftClickedOnTile(x-1,y+1);
    }
        
    if(y+1 <= gameSize-1) {
        userLeftClickedOnTile(x,y+1);
    }
       
    if(y-1 >= 0) {
        userLeftClickedOnTile(x,y-1);
    }

}

//Fonction qui marque la tuile avec d'abord un drapeau puis un '?', puis elle revient à la normale.
function userRightClickedOnTile(x,y){
    switch (true){

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 0 && didPlayerLost == false:
            var imageMarkedTile = document.createElement("img");
            imageMarkedTile.src = "./image/markedTile.jpg";
            imageMarkedTile.addEventListener('load', function(){
                ctx.drawImage(imageMarkedTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 1;
            bombsNumber--;
            document.getElementById('compteur').innerHTML = bombsNumber;
            if(tileDiscovered == tileToDiscover && bombsNumber == 0){
                playerWon();
            }
            break;

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 1 && didPlayerLost == false:
            var imageQuestionningTile = document.createElement("img");
            imageQuestionningTile.src = "./image/questionningTile.jpg";
            imageQuestionningTile.addEventListener('load', function(){
                ctx.drawImage(imageQuestionningTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 2;
            bombsNumber++;
            document.getElementById('compteur').innerHTML = bombsNumber;
            break;

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 2 && didPlayerLost == false:
            var imageTile = document.createElement("img");
            imageTile.src = "./image/tile.jpg";
            imageTile.addEventListener('load', function(){
                ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 0;
            break;
    }

}

//Le joueur a gagné
function playerWon(){

    playerWonDiv.style.display ="block";
        
}

//Le joueur a perdu, on affiche les bombes
function playerLost(){

    didPlayerLost = true;
    var imageBombTile = document.createElement("img");
    imageBombTile.src = "./image/bombTile.png";
    for (let x = 0 ; x < gameSize ; x++) {
        for (let y = 0 ; y < gameSize ; y++) {
            if(hiddenTileArray[x][y].value >= 10){
                imageBombTile.addEventListener('load', function(){
                ctx.drawImage(imageBombTile, x*45, y*48, 45, 48,);
                }, false);
            }
        }
    }
    document.getElementById('retryButton').style.display = "block";

}

//fonction qui va renvoyer la position du curseur en x,y dans un tableau
function getPosition(canvas, event) {

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let position = new Position;
    position.x = x
    position.y = y
    return position;

}

//Fonction qui affiche un nombre d'images de tuiles en fonction de la difficulté.
function displayTiles() {

    ctx.canvas.width  = gameSize*45;
    ctx.canvas.height = gameSize*48;
    document.getElementById('compteur').innerHTML = bombsNumber;
    for (let x = 0; x < gameSize; x++) {
        for (let y = 0; y < gameSize; y++) {
        var imageTile = document.createElement("img");
        imageTile.src = "./image/tile.jpg";
        imageTile.addEventListener('load', function(){
            ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
        }, false);
        }
    }
}

//Fonction qui crée un tableau 7*7 ou 10*10 ou 15*15 en fonction de la difficulté choisie et l'initialise à 0 partout.
function createHiddenTileArray() {
    
    var tileArrayHidden = new Array(gameSize)

    for (let i = 0; i < gameSize; i++){
        tileArrayHidden[i] = new Array(gameSize);
    }
    //On a créé un tableau vide.
    for(let i = 0; i < gameSize ; i++) {
        for(let j = 0; j < gameSize ; j++){
            tileArrayHidden[i][j] = new Tile(0,false,0);
        }
        //On a initialisé à 0.  
    } 
    return tileArrayHidden;

}

//Fonction qui place le nombre 10 (qui représente les bombes) à un emplacement aléatoire dans le tableau. On répète l'opération en fonction de la difficulté.
function placeBombs() {
    for (let i = 0; i < bombsNumber; i++){
        a = randomInt(gameSize-1);
        b = randomInt(gameSize-1);
        if(hiddenTileArray[a][b].value != 10){
            hiddenTileArray[a][b].value = 10;
        } else i--;
    }

}

//Fonction qui associe au tuiles leur numéro, en fonction des bombes adjascentes (+1 par bombe)
function setTilesNumber() {

    for(let i = 0 ; i < gameSize ; i++){

        for(let j = 0 ; j < gameSize ; j++){

                if(i+1 <= gameSize-1 && hiddenTileArray[i+1][j].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i+1 <= gameSize-1 && j+1 <= gameSize-1 && hiddenTileArray[i+1][j+1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i+1 <= gameSize-1 && j-1 >= 0 && hiddenTileArray[i+1][j-1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && hiddenTileArray[i-1][j].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && j-1 >= 0 && hiddenTileArray[i-1][j-1].value >= 10){
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && j+1 <= gameSize-1 && hiddenTileArray[i-1][j+1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(j+1 <= gameSize-1 && hiddenTileArray[i][j+1].value >= 10) {
                     hiddenTileArray[i][j].value += 1
                }
                   
                if(j-1 >= 0 && hiddenTileArray[i][j-1].value >= 10) {
                     hiddenTileArray[i][j].value += 1
                }
  
            }

    }
}

//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
function randomInt(max) {

    return Math.floor(Math.random() * (max + 1));

}