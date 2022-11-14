const bouttonDifficulteeFacile = document.getElementById('bouttonDifficulteeFacile');
const bouttonDifficulteeMoyenne = document.getElementById('bouttonDifficulteeMoyenne');
const bouttonDifficulteeDifficile = document.getElementById('bouttonDifficulteeDifficile');

let difficultee = 0;
var talbeauTuiles = new Array();


bouttonDifficulteeFacile.addEventListener('click', () => {
    //alert('vous avez choisis la difficultée facile');
    difficultee = 5;
    dimensionTableauTuiles(difficultee);
    affichageTableauTuiles(difficultee);
})

bouttonDifficulteeMoyenne.addEventListener('click', () => {
    //alert('vous avez choisis la difficultée moyenne');
    difficultee = 7;
    dimensionTableauTuiles(difficultee);
    affichageTableauTuiles(difficultee);
})

bouttonDifficulteeDifficile.addEventListener('click', () => {
    //alert('vous avez choisis la difficultée difficile')
    difficultee = 9;
    dimensionTableauTuiles(difficultee);
    affichageTableauTuiles(difficultee);
})


function dimensionTableauTuiles(difficultee) {
    talbeauTuiles = new Array(difficultee);
    for (let i = 0; i < difficultee; i++) {
        talbeauTuiles[i] = new Array(difficultee)
    }
    console.log("creation", talbeauTuiles);
}

function affichageTableauTuiles(difficultee) {
    
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    for (let x = 0; x < difficultee; x++) {
        var ligne = document.createElement("tr");
        for (let y = 0; y < difficultee; y++) {
            var tuile = document.createElement("td");
            var bouttonTuile = document.createElement('button');
            var bouttonText = document.createTextNode("");
            tuile.appendChild(bouttonTuile);
            bouttonTuile.appendChild(bouttonText);
            ligne.appendChild(tuile);
        }
        tableBody.appendChild(ligne); 
    }
    
    table.appendChild(tableBody);
    body.appendChild(table);
    table.setAttribute("border", "2");
}