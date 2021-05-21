//global variable

var DIFFICULTY = "EASY";
var X_NEXT = true;


//setup process
const create_grid_cells = () => {
    var grid_divs = [];
    for(var i = 0; i < 9; i++){
        grid_divs.push(`<div class="game-cell" id=${"cell_" + i.toString()}></div>`);
    }
    document.getElementById("game-grid").innerHTML = 
    `
    ${grid_divs.join("")}
    `;
}

const updateLevelText = () => {
    const highlightColor = "#f0cd30";
    const easy = document.getElementById("easy");
    const hard = document.getElementById("hard");
    easy.style.color="#FFFFFF";
    easy.style.fontWeight="normal";
    hard.style.color="#FFFFFF";
    hard.style.fontWeight="normal";    
    if(DIFFICULTY==="EASY"){
        easy.style.color=highlightColor
        easy.style.fontWeight="bold";
    }
    else{
        hard.style.color=highlightColor;
        hard.style.fontWeight="bold";    
    }
}

const attachListeners = () => {
    // const status = document.getElementById("status");
    const reset = document.getElementById("reset");
    const game_cells = document.querySelectorAll(".game-cell");
    const easy_button = document.getElementById("easy");
    const hard_button = document.getElementById("hard");

    game_cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    })
    reset.addEventListener('click', handleReset);
    easy_button.addEventListener('click', handleDifficultyClick);
    hard_button.addEventListener('click', handleDifficultyClick);
}


//event handlers 
const handleReset = (e) => {
    if(confirm('Are you sure you want to reset the game?')){
        create_grid_cells();
        attachListeners();
        console.log("Reseted");
    }
}

const handleCellClick = (e) => {
    console.log(`${e.target.id} clicked`);
    const classList = e.target.classList;
    
    if(classList.length !== 1){
        //used cell
        return;
    }

    if(X_NEXT){
        classList.add("x");
        X_NEXT = !X_NEXT;
    }
    else{
        classList.add("o");
        X_NEXT = !X_NEXT;
    }

    console.log(`X is next: ${X_NEXT}`);


}

const handleDifficultyClick = (e) => {
    const id = e.target.id;
    if(id === "easy"){
        DIFFICULTY = "EASY";
    }
    else{
        DIFFICULTY = "HARD";
    }
    updateLevelText();
}

create_grid_cells();
updateLevelText();
attachListeners();
