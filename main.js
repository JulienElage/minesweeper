const bouttonDifficulteeFacile = document.getElementById('bouttonDifficulteeFacile');
const bouttonDifficulteeMoyenne = document.getElementById('bouttonDifficulteeMoyenne');
const bouttonDifficulteeDifficile = document.getElementById('bouttonDifficulteeDifficile');

bouttonDifficulteeFacile.addEventListener('click', () => {
    alert('vous avez choisis la difficultée facile')
})

bouttonDifficulteeMoyenne.addEventListener('click', () => {
    alert('vous avez choisis la difficultée moyenne')
})

bouttonDifficulteeDifficile.addEventListener('click', () => {
    alert('vous avez choisis la difficultée difficile')
})