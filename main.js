
const easyDifficultyButton = document.getElementById('easyDifficultyButton');
const normalDifficultyButton = document.getElementById('normalDifficultyButton');
const hardDifficultyButton = document.getElementById('hardDifficultyButton');
const playerLostDiv = document.getElementById('retryDiv');
const playerWonDiv = document.getElementById('playerWinDiv');
const retryButton = document.getElementById('retryButton');
const playAgainButton = document.getElementById('playAgainButton');
const canvas = document.querySelector('canvas');
let chrono = document.getElementById('chrono');
let isRunning = false;
let hours = 0;
let minutes = 0;
let seconds = 0;
let timeout;
var didPlayerLost = false;
var hiddenTileArray;
let gameSize = 0;
var difficulty = "easy"
let bombsNumber = 0;
let tileDiscovered = 0;
let tileToDiscover = 0;
let ctx = canvas.getContext('2d');
let firstClick = false;

class Tile {
    value = 0;
    isDiscovered = false;
    isMarked =0;
    isDblClicked = false;
    constructor(value, isDiscovered, isMarked, isDblClicked) {
        this.value = value;
        this.isDiscovered = isDiscovered;
        this.isMarked = isMarked;
        this.isTest = isDblClicked;
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

//L'utilisateur clic sur le boutton pour lancer une nouvelle partie
retryButton.addEventListener('click', () =>{
    start();
})

//L'utilisateur à gagner, il clic sur le boutton pour lancer une nouvelle partie
playAgainButton.addEventListener('click', () =>{
    start();
})

//Cette fonction lance la partie en fonction des parametres
  function start() {

    switch (difficulty){
        case "easy":     
            gameSize = 6;
            break;
        case "normal":
            gameSize = 12;
            break;
        case "hard":
            gameSize = 18;
            break;
    }
    resetChrono();
    firstClick = false;
    didPlayerLost = false;
    bombsNumber = (gameSize*gameSize*1/6);
    tileToDiscover = gameSize*gameSize - bombsNumber;
    tileDiscovered = 0;
    playerLostDiv.style.display = "none";
    playerWonDiv.style.display = "none";
    hiddenTileArray = createHiddenTileArray();
    displayTiles();
}

//L'utilisateur fait un clic gauche sur une tuile, on envoie la position du clic
canvas.addEventListener('click', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = position.x
    y = position.y
    userLeftClickedOnTile(x,y);

})

//L'utilisateur fait un clic droit sur une tuile, on envoie la position du clic
canvas.addEventListener('contextmenu', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = position.x
    y = position.y
    userRightClickedOnTile(x,y);
    e.preventDefault();

})

//L'utilisateur fait un double clic gauche sur une tuile, on envoie la position du clic
canvas.addEventListener('dblclick', function(e) {

    var position = new Position;
    position = getPosition(canvas, e);
    x = position.x
    y = position.y
    userDoubleClickedOnTile(x,y);

})

//Fonction qui va découvrir la tuile, si elle ne l'est pas déjà, et si elle n'est pas marquée (drapeau ou '?').
function userLeftClickedOnTile(x,y){
    //Lors du premier clic on lance le chrono, on place les bombes et on attribue la valeur des tuiles
    if(firstClick == false) {
        isRunning = true;
        startChrono();
        placeBombs(x,y);
        setTilesNumber();
        firstClick = true;
    }
    //On vérifie si la case n'est pas déjà découverte, et si elle est marquée, et si le joueur a perdu.
    if(hiddenTileArray[x][y].isDiscovered == false && hiddenTileArray[x][y].isMarked == 0 && didPlayerLost == false){
        hiddenTileArray[x][y].isDiscovered = true;
        //On vérifie si le joueur clique sur une bombe, si oui on affiche une bombe sur la tuile.
        if(hiddenTileArray[x][y].value >= 10){
                playerLost();
                var imageBombOnClick = document.createElement("img");
                imageBombOnClick.src = "./image/bombOnClick.png";
                imageBombOnClick.addEventListener('load', function(){
                    ctx.drawImage(imageBombOnClick, x*45, y*48, 45, 48,);
                    }, false);
        } 
        else {
            //Sinon on affiche une image de tuile découverte
            tileDiscovered++;
            let value = hiddenTileArray[x][y].value;
            var imageDiscoveredTile = document.createElement("img");
            imageDiscoveredTile.src = "./image/discoveredTile.jpg";
            imageDiscoveredTile.addEventListener('load', function(){
                ctx.drawImage(imageDiscoveredTile, x*45, y*48, 45, 48,);
                switch(true){
                    //Si la valeur de la tuile est 0, on découvre les cases adjacentes
                    case (value == 0):
                        discovedAdjacentTiles(x,y);
                        break;
                     //On écrit la valeur de la tuile si elle est suppérieur à 0, en variant les couleurs
                    case (value ==1):
                        ctx.fillStyle = "green"
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText(value, x*45+22.5,y*48+24);
                        break;
                    case (value ==2):
                        ctx.fillStyle = "blue";
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText(value, x*45+22.5,y*48+24);
                        break;
                    case (value == 3):
                        ctx.fillStyle = "purple";
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText(value, x*45+22.5,y*48+24);
                        break;
                    case (value > 3):
                        ctx.fillStyle = "darkred";
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText(value, x*45+22.5,y*48+24);
                        break;
                }
            }, false);
            //On vérifie si le joueur a gagné
            if(tileDiscovered == tileToDiscover && bombsNumber == 0){
                playerWon();
            }
        }
    }

}

//Fonction qui marque la tuile avec d'abord un drapeau puis un '?', puis elle revient à la normale.
function userRightClickedOnTile(x,y){
    //En fonction des cas, on affiche la tuile avec un drapeau, ou avec un '?' ou non découverte.
    switch (true){
        //On vérifie si la tuile est déjà découverte, et si elle n'est pas marqué, et si le joueur n'a pas perdu, si oui on l'affiche avec un drapeau
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

        //On vérifie si la tuile est déjà découverte, et si elle est déjà marqué d'un drapeau, et si le joueur n'a pas perdu, si oui on l'affiche avec un '?'
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

        //On vérifie si la tuile est déjà découverte, et si elle est déjà marqué d'un '?', et si le joueur n'a pas perdu, si oui on l'affiche non découverte
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

//Fonction qui découvre les tuiles adjacentes, si on a marqué le bon nombre de tuiles adjacentes
function userDoubleClickedOnTile(x,y) {
    if(hiddenTileArray[x][y].isDiscovered == true && hiddenTileArray[x][y].isDblClicked == false) {
        if(checkAdjacentMarkedBomb(x,y)) {
            hiddenTileArray[x][y].isTest = true;
            discovedAdjacentTiles(x,y);
        }
    }
}

//Fonction qui va découvrir les cases adjacentes
function discovedAdjacentTiles(x,y) {

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

//fonction qui va retourner vrai si le nombre de bombes adjacentes est bien le nombre de tuiles adjacentes marquées
function checkAdjacentMarkedBomb(x,y) {
    var adjacentBombMarked = 0;
    if(x+1 <= gameSize-1 && hiddenTileArray[x+1][y].isMarked == 1) {
        adjacentBombMarked++
    }
        
    if(x+1 <= gameSize-1 && y+1 <= gameSize-1 && hiddenTileArray[x+1][y+1].isMarked == 1) {
        adjacentBombMarked++
    }
        
    if(x+1 <= gameSize-1 && y-1 >= 0 && hiddenTileArray[x+1][y-1].isMarked == 1) {
        adjacentBombMarked++
    }
        
    if(x-1 >= 0 && hiddenTileArray[x-1][y].isMarked == 1) {
        adjacentBombMarked++
    }
        
    if(x-1 >= 0 && y-1 >= 0 && hiddenTileArray[x-1][y-1].isMarked == 1){
        adjacentBombMarked++
    }
        
    if(x-1 >= 0 && y+1 <= gameSize-1 && hiddenTileArray[x-1][y+1].isMarked == 1) {
        adjacentBombMarked++
    }
        
    if(y+1 <= gameSize-1 && hiddenTileArray[x][y+1].isMarked == 1) {
        adjacentBombMarked++
    }
       
    if(y-1 >= 0 && hiddenTileArray[x][y-1].isMarked == 1) {
        adjacentBombMarked++
    }
    if(adjacentBombMarked == hiddenTileArray[x][y].value) {
        return true;
    } else {
        return false;
    }
    
}

//Le joueur a gagné, on affiche un block spécial
function playerWon(){

    stopChrono();
    playerWonDiv.style.display ="block";
        
}

//Le joueur a perdu, on affiche toutes les bombes, et un block spécial
function playerLost(){
    isRunning = false;
    stopChrono();
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
    playerLostDiv.style.display = "block";

}

//fonction qui va renvoyer la position du curseur en x,y
function getPosition(canvas, event) {

    const rect = canvas.getBoundingClientRect()
    //Calcul de la position en nombres entiers
    const x = Math.floor((event.clientX - rect.left)/45)
    const y = Math.floor((event.clientY - rect.top)/48)
    let position = new Position;
    position.x = x
    position.y = y
    return position;

}

//Fonction qui affiche le nombre de tuiles en fonction de la difficulté.
function displayTiles() {

    //Chaque image faut 45*48 pixel, on calcul la taille du canvas
    ctx.canvas.width  = gameSize*45;
    ctx.canvas.height = gameSize*48;
    //On affiche le nombre de bombes
    document.getElementById('compteur').innerHTML = bombsNumber;
    //On affiche toutes les tuiles
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

//Fonction qui crée un tableau de tuiles caché en fonction de la difficulté choisie et l'initialise
function createHiddenTileArray() {
    
    var hiddenTileArray = new Array(gameSize)

    for (let i = 0; i < gameSize; i++){
        hiddenTileArray[i] = new Array(gameSize);
    }
    //On a créé un tableau vide.
    for(let i = 0; i < gameSize ; i++) {
        for(let j = 0; j < gameSize ; j++){
            //On initialise à valeur 0, non découverte, non marqué, non double cliqué
            hiddenTileArray[i][j] = new Tile(0,false,0,false);
        } 
    } 
    return hiddenTileArray;

}

//Fonction qui place le nombre 10 (qui représente les bombes) à un emplacement aléatoire dans le tableau. On répète l'opération en fonction de la difficulté.
function placeBombs(x,y) {

    for (let i = 0; i < bombsNumber; i++){
        a = randomInt(gameSize-1);
        b = randomInt(gameSize-1);
        //On vérifie qu'il n'y est pas déjà une bombe sur l'emplacement et que celui-ci n'est pas le même que le premier clic
        if(hiddenTileArray[a][b].value != 10 && (a != x || b != y)){
             hiddenTileArray[a][b].value = 10;
        }
        else i--;
    }

}

//Fonction qui associe au tuiles leur numéro, en fonction des bombes adjascentes (+1 par bombe)
function setTilesNumber() {

    for(let i = 0 ; i < gameSize ; i++){

        for(let j = 0 ; j < gameSize ; j++){
                //On doit vérifier à chaque fois que la tuile adjacente existe, car ce n'est pas toujours le cas pour les cases en bord de tableau
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
    console.log(hiddenTileArray)
}

//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
function randomInt(max) {

    return Math.floor(Math.random() * (max + 1));

}

//Fonction chrono qui affiche le temps passé toutes les secondes
function startChrono() {
    if(isRunning == true){
        seconds = parseInt(seconds);
        hours = parseInt(hours);
        minutes = parseInt(minutes);

        seconds++;

        if(seconds == 60){
            minutes++
            seconds = 0;
        }

        if(minutes == 60){
            hours++
            minutes = 0;
        }
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        if(minutes < 10){
            minutes = "0" + minutes
        }
        if(hours < 10){
            hours = "0" + hours
        }
        chrono.textContent = `${hours}:${minutes}:${seconds}`

        setTimeout(startChrono, 1000);
    }
    
}

//fonction qui arrête le chrono
function stopChrono() {
    isRunning = false;
    chrono.textContent = `${hours}:${minutes}:${seconds}`
}

//Fonction qui remet le chrono à 00:00:00
function resetChrono() {
        isRunning = false;
        chrono.textContent = "00:00:00";
        hours = "0";
        minutes = "0";
        seconds = "0";
        clearTimeout(timeout);
}