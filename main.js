const easyDifficultyButton = document.getElementById('easyDifficultyButton');
const normalDifficultyButton = document.getElementById('normalDifficultyButton');
const hardDifficultyButton = document.getElementById('hardDifficultyButton');

let difficulty = 0;
var tileArray = new Array();


easyDifficultyButton.addEventListener('click', () => {
    difficulty = 7;
    tileArrayDimension(difficulty);
    tileArrayDisplay(difficulty);
    //placeBombs(difficulty);
})

normalDifficultyButton.addEventListener('click', () => {
    difficulty = 10;
    tileArrayDimension(difficulty);
    tileArrayDisplay(difficulty);
    //placeBombs(difficulty);
})

hardDifficultyButton.addEventListener('click', () => {
    difficulty = 15;
    tileArrayDimension(difficulty);
    tileArrayDisplay(difficulty);
    //placeBombs(difficulty);
})


function tileArrayDimension(difficulty) {
    var longueur = "";
    for (let i = 0; i < difficulty - 1; i++) {
        var ctr = "[0,0],";
        var longueur = longueur + ctr;
    }
    longueur = longueur + "[0,0]";
    let test = [
        longueur
    ]
}

function tileArrayDisplay(difficulty) {
    
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    for (let x = 0; x < difficulty; x++) {
        var raw = document.createElement("tr");
        for (let y = 0; y < difficulty; y++) {
            var tile = document.createElement("td");
            var tileButton = document.createElement('button');
            tile.appendChild(tileButton);
            raw.appendChild(tile);
        }
        tableBody.appendChild(raw); 
    }
    
    table.appendChild(tableBody);
    body.appendChild(table);
    table.setAttribute("border", "2");
}

function randomInt(max)
{
    return Math.floor(Math.random() * (max + 1));
}

function placeBombs(difficulty) {
    for (let i = 0; i < difficulty; i++){
        a = randomInt(difficulty);
        b = randomInt(difficulty);
        console.log(a,b);
        if(tileArray[a][b] != 10){
            tileArray[a][b] = 10;
        } 
        else i--;
    }
    console.log(tileArray);
}