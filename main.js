var chrono;
var game;
var page;
var player;

class Game {

    gameSize = 0;
    hiddenTileArray;
    didPlayerLost = false;
    bombsNumber = 0;
    tileDiscovered = 0;
    tileToDiscover = 0;
    firstClick = false;

    constructor(difficulty) {
       
        this.difficulty = difficulty;
        switch (this.difficulty){
            case "easy":     
                this.gameSize = 6;
                break;
            case "normal":
                this.gameSize = 12;
                break;
            case "hard":
                this.gameSize = 18;
                break;
        }
        this.bombsNumber = (this.gameSize*this.gameSize*1/6);
        this.tileToDiscover = this.gameSize*this.gameSize - this.bombsNumber;
        this.tileDiscovered = 0;
        page.playerLostDiv.style.display = "none";
        page.playerWinDiv.style.display = "none";
        chrono.resetChrono();
        this.createHiddenTileArray();
        this.displayTiles();
    
    }

    displayTiles() {

        //Chaque image faut 45*48 pixel, on calcul la taille du canvas
        page.ctx.canvas.width  = this.gameSize*45;
        page.ctx.canvas.height = this.gameSize*48;
        //On affiche le nombre de bombes
        document.getElementById('compteur').innerHTML = this.bombsNumber;
        //On affiche toutes les tuiles
        for (let x = 0; x < this.gameSize; x++) {
            for (let y = 0; y < this.gameSize; y++) {
            var imageTile = document.createElement("img");
            imageTile.src = "./image/tile.jpg";
            imageTile.addEventListener('load', function(){
                page.ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
            }, false);
            }
        }
    }

    createHiddenTileArray() {
        this.hiddenTileArray = new Array(this.gameSize)
    
        for (let i = 0; i < this.gameSize; i++){
            this.hiddenTileArray[i] = new Array(this.gameSize);
        }
        //On a créé un tableau vide.
        for(let i = 0; i < this.gameSize ; i++) {
            for(let j = 0; j < this.gameSize ; j++){
                //On initialise à valeur 0, non découverte, non marqué, non double cliqué
                this.hiddenTileArray[i][j] = new Tile(0,false,0,false);
            } 
        } 
    }

    userLeftClickedOnTile(x,y) {

        if(this.firstClick == false) {
            chrono.isRunning = true;
            chrono.startChrono();
            this.placeBombs(x,y);
            this.setTilesNumber();
            this.firstClick = true;
        }
        if(this.hiddenTileArray[x][y].isDiscovered == false && this.hiddenTileArray[x][y].isMarked == 0 && this.didPlayerLost == false){
            this.hiddenTileArray[x][y].isDiscovered = true;
            //On vérifie si le joueur clique sur une bombe, si oui on affiche une bombe sur la tuile.
            if(this.hiddenTileArray[x][y].value >= 10){
                    this.playerLost();
                    var imageBombOnClick = document.createElement("img");
                    imageBombOnClick.src = "./image/bombOnClick.png";
                    imageBombOnClick.addEventListener('load', function(){
                        page.ctx.drawImage(imageBombOnClick, x*45, y*48, 45, 48,);
                        }, false);
            } 
            else {
                //Sinon on affiche une image de tuile découverte
                this.tileDiscovered++;
                let value = this.hiddenTileArray[x][y].value;
                var imageDiscoveredTile = document.createElement("img");
                imageDiscoveredTile.src = "./image/discoveredTile.jpg";
                imageDiscoveredTile.addEventListener('load', function(){
                    page.ctx.drawImage(imageDiscoveredTile, x*45, y*48, 45, 48,);
                    switch(true){
                        //Si la valeur de la tuile est 0, on découvre les cases adjacentes
                        case (value == 0):
                            game.discoverAdjacentTiles(x,y);
                            break;
                         //On écrit la valeur de la tuile si elle est suppérieur à 0, en variant les couleurs
                        case (value ==1):
                            page.ctx.fillStyle = "green"
                            page.ctx.font = "15px Arial";
                            page.ctx.textAlign = "center";
                            page.ctx.fillText(value, x*45+22.5,y*48+24);
                            break;
                        case (value ==2):
                            page.ctx.fillStyle = "blue";
                            page.ctx.font = "15px Arial";
                            page.ctx.textAlign = "center";
                            page.ctx.fillText(value, x*45+22.5,y*48+24);
                            break;
                        case (value == 3):
                            page.ctx.fillStyle = "purple";
                            page.ctx.font = "15px Arial";
                            page.ctx.textAlign = "center";
                            page.ctx.fillText(value, x*45+22.5,y*48+24);
                            break;
                        case (value > 3):
                            page.ctx.fillStyle = "darkred";
                            page.ctx.font = "15px Arial";
                            page.ctx.textAlign = "center";
                            page.ctx.fillText(value, x*45+22.5,y*48+24);
                            break;
                    }
                }, false);
                //On vérifie si le joueur a gagné
                if(this.tileDiscovered == this.tileToDiscover && this.bombsNumber == 0){
                   this.playerWin();
                }
            }
        }
    }

    userRightClickedOnTile(x,y) {
        switch (true){
            //On vérifie si la tuile est déjà découverte, et si elle n'est pas marqué, et si le joueur n'a pas perdu, si oui on l'affiche avec un drapeau
            case this.hiddenTileArray[x][y].isDiscovered == false && this.hiddenTileArray[x][y].isMarked == 0 && this.didPlayerLost == false:
                var imageMarkedTile = document.createElement("img");
                imageMarkedTile.src = "./image/markedTile.jpg";
                imageMarkedTile.addEventListener('load', function(){
                    page.ctx.drawImage(imageMarkedTile, x*45, y*48, 45, 48,);
                }, false);
                this.hiddenTileArray[x][y].isMarked = 1;
                this.bombsNumber--;
                document.getElementById('compteur').innerHTML = this.bombsNumber;
                if(this.tileDiscovered == this.tileToDiscover && this.bombsNumber == 0){
                    this.playerWin();
                }
                break;
    
            //On vérifie si la tuile est déjà découverte, et si elle est déjà marqué d'un drapeau, et si le joueur n'a pas perdu, si oui on l'affiche avec un '?'
            case this.hiddenTileArray[x][y].isDiscovered == false && this.hiddenTileArray[x][y].isMarked == 1 && this.didPlayerLost == false:
                var imageQuestionningTile = document.createElement("img");
                imageQuestionningTile.src = "./image/questionningTile.jpg";
                imageQuestionningTile.addEventListener('load', function(){
                    page.ctx.drawImage(imageQuestionningTile, x*45, y*48, 45, 48,);
                }, false);
                this.hiddenTileArray[x][y].isMarked = 2;
                this.bombsNumber++;
                document.getElementById('compteur').innerHTML = this.bombsNumber;
                break;
    
            //On vérifie si la tuile est déjà découverte, et si elle est déjà marqué d'un '?', et si le joueur n'a pas perdu, si oui on l'affiche non découverte
            case this.hiddenTileArray[x][y].isDiscovered == false && this.hiddenTileArray[x][y].isMarked == 2 && this.didPlayerLost == false:
                var imageTile = document.createElement("img");
                imageTile.src = "./image/tile.jpg";
                imageTile.addEventListener('load', function(){
                    page.ctx.drawImage(imageTile, x*45, y*48, 45, 48,);
                }, false);
                this.hiddenTileArray[x][y].isMarked = 0;
                break;
        }
    }

    userDoubleClickedOnTile(x,y){

        if(this.hiddenTileArray[x][y].isDiscovered == true && this.hiddenTileArray[x][y].isDblClicked == false) {
            if(this.checkAdjacentMarkedBomb(x,y)) {
                this.hiddenTileArray[x][y].isDblClicked = true;
                this.discoverAdjacentTiles(x,y);
            }
        }

    }

    checkAdjacentMarkedBomb(x,y) {

        var adjacentBombMarked = 0;
        if(x+1 <= this.gameSize-1 && this.hiddenTileArray[x+1][y].isMarked == 1) {
            adjacentBombMarked++
        }
            
        if(x+1 <= this.gameSize-1 && y+1 <= this.gameSize-1 && this.hiddenTileArray[x+1][y+1].isMarked == 1) {
            adjacentBombMarked++
        }
            
        if(x+1 <= this.gameSize-1 && y-1 >= 0 && this.hiddenTileArray[x+1][y-1].isMarked == 1) {
            adjacentBombMarked++
        }
            
        if(x-1 >= 0 && this.hiddenTileArray[x-1][y].isMarked == 1) {
            adjacentBombMarked++
        }
            
        if(x-1 >= 0 && y-1 >= 0 && this.hiddenTileArray[x-1][y-1].isMarked == 1){
            adjacentBombMarked++
        }
            
        if(x-1 >= 0 && y+1 <= this.gameSize-1 && this.hiddenTileArray[x-1][y+1].isMarked == 1) {
            adjacentBombMarked++
        }
            
        if(y+1 <= this.gameSize-1 && this.hiddenTileArray[x][y+1].isMarked == 1) {
            adjacentBombMarked++
        }
           
        if(y-1 >= 0 && this.hiddenTileArray[x][y-1].isMarked == 1) {
            adjacentBombMarked++
        }
        if(adjacentBombMarked == this.hiddenTileArray[x][y].value) {
            return true;
        } else {
            return false;
        }
    }

    discoverAdjacentTiles(x,y) {

        if(x+1 <= this.gameSize-1) {
            this.userLeftClickedOnTile(x+1,y);
        }
            
        if(x+1 <= this.gameSize-1 && y+1 <= this.gameSize-1) {
            this.userLeftClickedOnTile(x+1,y+1);
        }
            
        if(x+1 <= this.gameSize-1 && y-1 >= 0) {
            this.userLeftClickedOnTile(x+1,y-1);
        }
            
        if(x-1 >= 0) {
            this.userLeftClickedOnTile(x-1,y);
        }
            
        if(x-1 >= 0 && y-1 >= 0){
            this.userLeftClickedOnTile(x-1,y-1);
        }
            
        if(x-1 >= 0 && y+1 <= this.gameSize-1) {
            this.userLeftClickedOnTile(x-1,y+1);
        }
            
        if(y+1 <= this.gameSize-1) {
            this.userLeftClickedOnTile(x,y+1);
        }
           
        if(y-1 >= 0) {
            this.userLeftClickedOnTile(x,y-1);
        }
    }

    placeBombs(x,y) {
        for (let i = 0; i < this.bombsNumber; i++){
            var a = randomInt(this.gameSize-1);
            var b = randomInt(this.gameSize-1);
            //On vérifie qu'il n'y est pas déjà une bombe sur l'emplacement et que celui-ci n'est pas le même que le premier clic
            if(this.hiddenTileArray[a][b].value != 10 && (a != x || b != y)){
                 this.hiddenTileArray[a][b].value = 10;
            }
            else i--;
        }
    }

    setTilesNumber(){

        for(let i = 0 ; i < this.gameSize ; i++){

            for(let j = 0 ; j < this.gameSize ; j++){
                    //On doit vérifier à chaque fois que la tuile adjacente existe, car ce n'est pas toujours le cas pour les cases en bord de tableau
                    if(i+1 <= this.gameSize-1 && this.hiddenTileArray[i+1][j].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(i+1 <= this.gameSize-1 && j+1 <= this.gameSize-1 && this.hiddenTileArray[i+1][j+1].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(i+1 <= this.gameSize-1 && j-1 >= 0 && this.hiddenTileArray[i+1][j-1].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(i-1 >= 0 && this.hiddenTileArray[i-1][j].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(i-1 >= 0 && j-1 >= 0 && this.hiddenTileArray[i-1][j-1].value >= 10){
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(i-1 >= 0 && j+1 <= this.gameSize-1 && this.hiddenTileArray[i-1][j+1].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                        
                    if(j+1 <= this.gameSize-1 && this.hiddenTileArray[i][j+1].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
                       
                    if(j-1 >= 0 && this.hiddenTileArray[i][j-1].value >= 10) {
                        this.hiddenTileArray[i][j].value += 1
                    }
      
                }
        }
    }

    playerLost() {

        chrono.isRunning = false;
        chrono.stopChrono();
        game.didPlayerLost = true;
        var imageBombTile = document.createElement("img");
        imageBombTile.src = "./image/bombTile.png";
        for (let x = 0 ; x < game.gameSize ; x++) {
            for (let y = 0 ; y < game.gameSize ; y++) {
                if(game.hiddenTileArray[x][y].value >= 10){
                    imageBombTile.addEventListener('load', function(){
                    page.ctx.drawImage(imageBombTile, x*45, y*48, 45, 48,);
                    }, false);
                }
            }
        }
        page.playerLostDiv.style.display = "block";

    }

    playerWin() {
    
        chrono.stopChrono();
        page.playerWinDiv.style.display ="block";
        
    }
    
    getDifficulty() {
        return this.difficulty;
    }
}

class Chrono {
    
    chrono = document.getElementById('chrono');
    isRunning = false;
    hours = 0;
    minutes = 0;
    seconds = 0;
    timeout;
    
    oneSecond() {
        setTimeout(this.startChrono(),1000);
    }
    //Fonction chrono qui affiche le temps passé toutes les secondes
    startChrono() {

        if(this.isRunning == true){
            this.seconds = parseInt(this.seconds);
            this.hours = parseInt(this.hours);
            this.minutes = parseInt(this.minutes);
    
            this.seconds++;
    
            if(this.seconds == 60){
                this.minutes++
                this.seconds = 0;
            }
    
            if(this.minutes == 60){
                this.hours++
                this.minutes = 0;
            }
            if(this.seconds < 10){
                this.seconds = "0" + this.seconds;
            }
            if(this.minutes < 10){
                this.minutes = "0" + this.minutes
            }
            if(this.hours < 10){
                this.hours = "0" + this.hours
            }

            this.chrono.textContent = `${this.hours}:${this.minutes}:${this.seconds}`

            setTimeout(function() {

                chrono.startChrono();

            },1000)
        }
    }

    //fonction qui arrête le chrono
    stopChrono() {

    this.isRunning = false;
    this.chrono.textContent = `${this.hours}:${this.minutes}:${this.seconds}`

    }

    //Fonction qui remet le chrono à 00:00:00
    resetChrono() {

        this.isRunning = false;
        this.chrono.textContent = "00:00:00";
        this.hours = "0";
        this.minutes = "0";
        this.seconds = "0";
        clearTimeout(this.timeout);

    }
}

class Page {

    easyDifficultyButton = document.getElementById('easyDifficultyButton');
    normalDifficultyButton = document.getElementById('normalDifficultyButton');
    hardDifficultyButton = document.getElementById('hardDifficultyButton');
    playerLostDiv = document.getElementById('retryDiv');
    playerWinDiv = document.getElementById('playerWinDiv');
    retryButton = document.getElementById('retryButton');
    playAgainButton = document.getElementById('playAgainButton');
    canvas = document.querySelector('canvas');
    rect = this.canvas.getBoundingClientRect()
    ctx = this.canvas.getContext('2d');

    getPosition(event) {
        //Calcul de la position en nombres entiers
        const x = Math.floor((event.clientX - this.rect.left)/45)
        const y = Math.floor((event.clientY - this.rect.top)/48)
        let position = new Position;
        position.x = x
        position.y = y
        return position;
    }
}

class Position {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Tile {
   
    constructor(value, isDiscovered, isMarked, isDblClicked) {
        this.value = value;
        this.isDiscovered = isDiscovered;
        this.isMarked = isMarked;
        this.isDblClicked = isDblClicked;
    }
}

//Au démarrage, on lance un démineur facile par défaut
document.addEventListener('DOMContentLoaded', function() {
    page = new Page();
    chrono = new Chrono();
    game = new Game("easy");

    //L'utilisateur choisis la difficulté facile
    page.easyDifficultyButton.addEventListener('click', () => {

        game = new Game("easy");

    })

    //L'utilisateur choisis la difficulté moyenne
    page.normalDifficultyButton.addEventListener('click', () => {

        game = new Game("normal");

    })

    //L'utilisateur choisis la difficulté difficile
    page.hardDifficultyButton.addEventListener('click', () => {

        game = new Game("hard");

    })
    
    //L'utilisateur clic sur le boutton pour lancer une nouvelle partie
    page.retryButton.addEventListener('click', () =>{

        var currentDifficulty = game.getDifficulty();
        game = new Game(currentDifficulty);

    })

    //L'utilisateur à gagner, il clic sur le boutton pour lancer une nouvelle partie
    page.playAgainButton.addEventListener('click', () =>{

        var currentDifficulty = game.getDifficulty();
        game = new Game(currentDifficulty);

    })

    //L'utilisateur fait un clic gauche sur une tuile, on envoie la position du clic
    page.canvas.addEventListener('click', function(e) {

        var position = new Position;
        position = page.getPosition(e);
        x = position.x
        y = position.y
        game.userLeftClickedOnTile(x,y);

    })

    //L'utilisateur fait un clic droit sur une tuile, on envoie la position du clic
    page.canvas.addEventListener('contextmenu', function(e) {

        var position = new Position;
        position = page.getPosition(e);
        x = position.x
        y = position.y
        game.userRightClickedOnTile(x,y)
        e.preventDefault();

    })

    
    //L'utilisateur fait un double clic gauche sur une tuile, on envoie la position du clic
    page.canvas.addEventListener('dblclick', function(e) {

        var position = new Position;
        position = page.getPosition(e);
        x = position.x
        y = position.y
        game.userDoubleClickedOnTile(x,y);

    })

});

//Fonction qui renvoie un nombre aléatoire (pas besoin d'un minimum, car c'est 0 dans notre cas).
function randomInt(max) {

    return Math.floor(Math.random() * (max + 1));

}