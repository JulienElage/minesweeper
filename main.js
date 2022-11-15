
const easyDifficultyButton = document.getElementById('easyDifficultyButton');
const normalDifficultyButton = document.getElementById('normalDifficultyButton');
const hardDifficultyButton = document.getElementById('hardDifficultyButton');
const canvas = document.querySelector('canvas')
var hiddenTileArray;
let difficulty = 0;
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
    hiddenTileArray = createHiddenTileArray();
    displayTiles();
    placeBombs();
    setTilesNumber();
})

//L'utilisateur choisis la difficulté
normalDifficultyButton.addEventListener('click', () => {
    difficulty = 10;
    hiddenTileArray = createHiddenTileArray();
    displayTiles();
    placeBombs();
    setTilesNumber();
})

//L'utilisateur choisis la difficulté
hardDifficultyButton.addEventListener('click', () => {
    difficulty = 15;
    hiddenTileArray = createHiddenTileArray();
    displayTiles();
    placeBombs();
    setTilesNumber();
})

//Fonction qui affiche un nombre d'images de tuiles en fonction de la difficultée.
function displayTiles() {

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
function createHiddenTileArray() {
    
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
function placeBombs() {

    for (let i = 0; i < difficulty; i++){
        a = randomInt(difficulty-1);
        b = randomInt(difficulty-1);
        if(hiddenTileArray[a][b].value != 10){
            hiddenTileArray[a][b].value = 10;
        } else i--;
    }
    //console.log(tileArrayHidden);
}

//Fonction qui associe au tuiles leur numéro, en fonction des bombes adjascentes (+1 par bombe)
function setTilesNumber() {

    for(let i = 0 ; i < difficulty ; i++){

        for(let j = 0 ; j < difficulty ; j++){

                if(i+1 <= difficulty-1 && hiddenTileArray[i+1][j].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i+1 <= difficulty-1 && j+1 <= difficulty-1 && hiddenTileArray[i+1][j+1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i+1 <= difficulty-1 && j-1 >= 0 && hiddenTileArray[i+1][j-1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && hiddenTileArray[i-1][j].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && j-1 >= 0 && hiddenTileArray[i-1][j-1].value >= 10){
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(i-1 >= 0 && j+1 <= difficulty-1 && hiddenTileArray[i-1][j+1].value >= 10) {
                    hiddenTileArray[i][j].value += 1
                }
                    
                if(j+1 <= difficulty-1 && hiddenTileArray[i][j+1].value >= 10) {
                     hiddenTileArray[i][j].value += 1
                }
                   
                if(j-1 >= 0 && hiddenTileArray[i][j-1].value >= 10) {
                     hiddenTileArray[i][j].value += 1
                }
  
            }

    }
    console.log(hiddenTileArray);
}

//L'utilisateur fait un clique gauche sur une tuile
canvas.addEventListener('click', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = Math.floor(position.x/45);
    y = Math.floor(position.y/48);
    userLeftClickedOnTile(x,y);
})

//L'utilisateur fait un clique droit sur une tuile
canvas.addEventListener('contextmenu', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = Math.floor(position.x/45);
    y = Math.floor(position.y/48);
    userRightClickedOnTile(x,y);
    e.preventDefault();

})

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

//Fonction qui va découvrir la tuile, si elle ne l'est pas déjà, et si elle n'est pas marquée (drapeau ou '?').
function userLeftClickedOnTile(x,y){

    if(hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 0){
        var imageBombTile = document.createElement("img");
        imageBombTile.src = "./image/bombTile.jpg";
        var imageDiscoveredTile = document.createElement("img");
        imageDiscoveredTile.src = "./image/discoveredTile.jpg";

        if(hiddenTileArray[x][y].value >= 10){
                imageBombTile.addEventListener('load', function(){
                ctx.drawImage(imageBombTile, x*45, y*48, 45, 48,);
                }, false);
                console.log("perdu");
        } 
        else {
            imageDiscoveredTile.addEventListener('load', function(){
            ctx.drawImage(imageDiscoveredTile, x*45, y*48, 45, 48,);
            let value = hiddenTileArray[x][y].value;
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            if(value != 0){
            ctx.fillText(value, x*45+22.5,y*48+24);
            }
            }, false);
        }
        hiddenTileArray[x][y].isDiscovered = true;
        if(hiddenTileArray[x][y].value == 0) {
             tileIsSetToZero(x,y)
        }
        
    }
}

function tileIsSetToZero(x,y) {

    if(x+1 <= difficulty-1) {
        userLeftClickedOnTile(x+1,y);
    }
        
    if(x+1 <= difficulty-1 && y+1 <= difficulty-1) {
        userLeftClickedOnTile(x+1,y+1);
    }
        
    if(x+1 <= difficulty-1 && y-1 >= 0) {
        userLeftClickedOnTile(x+1,y-1);
    }
        
    if(x-1 >= 0) {
        userLeftClickedOnTile(x-1,y);
    }
        
    if(x-1 >= 0 && y-1 >= 0){
        userLeftClickedOnTile(x-1,y-1);
    }
        
    if(x-1 >= 0 && y+1 <= difficulty-1) {
        userLeftClickedOnTile(x-1,y+1);
    }
        
    if(y+1 <= difficulty-1) {
        userLeftClickedOnTile(x,y+1);
    }
       
    if(y-1 >= 0) {
        userLeftClickedOnTile(x,y-1);
    }

}

//Fonction qui marque la tuile avec d'abord un drapeau puis un '?', puis elle revient à la normale.
function userRightClickedOnTile(x,y){
    switch (true){

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 0:
            var imageMarkedTile = document.createElement("img");
            imageMarkedTile.src = "./image/markedTile.jpg";
            imageMarkedTile.addEventListener('load', function(){
                ctx.drawImage(imageMarkedTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 1;
            break;

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 1:
            var imageQuestionningTile = document.createElement("img");
            imageQuestionningTile.src = "./image/questionningTile.jpg";
            imageQuestionningTile.addEventListener('load', function(){
                ctx.drawImage(imageQuestionningTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 2;
            break;

        case hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 2:
            var imageTile = document.createElement("img");
            imageTile.src = "./image/tile.jpg";
            imageTile.addEventListener('load', function(){
                ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
            }, false);
            hiddenTileArray[x][y].isMarked = 0;
            break;
    }

}

//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
function randomInt(max) {

    return Math.floor(Math.random() * (max + 1));

}
