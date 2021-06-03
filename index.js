//global variable

var GAME_MODE = "SINGLE";
var X_NAME = "Your"
var X_NEXT = true;
var GAME_STARTED = false;
var GAME_WON = false; 
var WINNER = "";


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

const updateGameModeText = () => {
    const highlightColor = "#f0cd30";
    const single_player = document.getElementById("single_player");
    const two_players = document.getElementById("two_players");
    single_player.style.color="#FFFFFF";
    single_player.style.fontWeight="normal";
    two_players.style.color="#FFFFFF";
    two_players.style.fontWeight="normal";    
    if(GAME_MODE==="SINGLE"){
        single_player.style.color=highlightColor
        single_player.style.fontWeight="bold";
    }
    else{
        two_players.style.color=highlightColor;
        two_players.style.fontWeight="bold";    
    }
}


const updateStatusText = () => {
    const status = document.getElementById("status");

    var game_cells_list = document.querySelectorAll(".game-cell");
    var vacant_cell = 0;
    for(var i = 0; i < game_cells_list.length; i++){
        var game_cell = game_cells_list[i];
        if(!game_cell.classList.contains("o") && !game_cell.classList.contains("x")){
            vacant_cell ++;
        }
    }
    if(vacant_cell === 0 && !GAME_WON){
        status.innerHTML = "Draw! Please Reset the Game.";
        return;
    }

    if(!GAME_WON)
        status.style.color = "#ffffff";
    else
        status.style.color = "#f70505";
    if(GAME_WON){
        status.innerHTML = `${WINNER.toUpperCase()} is the winner!`
        return;
    }

    if(X_NEXT){
        status.innerHTML = `${X_NAME} turn to move!`;
    }
    else{
        status.innerHTML = "O's turn to move!";
    }

}


const flash_winner_text = (index, is_row, is_col, diag_left) => {
    var element_list = [];
    const board = document.querySelectorAll(".game-cell");
    element_list.push(document.getElementById("status"));
    if(is_row){
        element_list.push(board[index * 3]);
        element_list.push(board[index * 3 + 1]);
        element_list.push(board[index * 3 + 2]);
    }
    else if(is_col){
        element_list.push(board[index]);
        element_list.push(board[index + 3]);
        element_list.push(board[index + 6]);
    }
    else if(diag_left){
        //diagonal from the left
        element_list.push(board[0]);
        element_list.push(board[4]);
        element_list.push(board[8]);
    }
    else{
        //diagonal from the right
        element_list.push(board[2]);
        element_list.push(board[4]);
        element_list.push(board[6]);
    }
    
    element_list.forEach(element => {
        element.style.color = "#f70505";
    });

}


const findTargetCellRandom = () => {
    var possible_cells = [];
    var game_cells_list = document.querySelectorAll(".game-cell");
    for(var i = 0; i < game_cells_list.length; i++){
        var game_cell = game_cells_list[i];
        if(!game_cell.classList.contains("o") && !game_cell.classList.contains("x")){
            possible_cells.push(game_cell);
        }
    }
    if(possible_cells.length === 0) return;
    var chosen_cell = possible_cells[Math.floor(Math.random() * possible_cells.length)];
    return chosen_cell;
}


const computerMakeMove = () => {
    if(GAME_WON) return;
    var target_cell = findTargetCellRandom();
    if(!target_cell){
        return;
    }
    setTimeout(() => { 
        target_cell.classList.add("o");
        X_NEXT = !X_NEXT;
        checkWinner();
        updateStatusText();
    }, 700);
    // target_cell.classList.add("o"); 
    
}


const attachListeners = () => {
    // const status = document.getElementById("status");
    const reset = document.getElementById("reset");
    const game_cells = document.querySelectorAll(".game-cell");
    const single_player_button = document.getElementById("single_player");
    const two_players_button = document.getElementById("two_players");

    game_cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    })
    reset.addEventListener('click', handleReset);
    single_player_button.addEventListener('click', handleGameModeClick);
    two_players_button.addEventListener('click', handleGameModeClick);
}

const checkWinner = () => {
    const board = document.querySelectorAll(".game-cell");
    for(var i = 0; i < 3; i++){
        if(is_row_same_symbol(i, board)){
            WINNER = board[i*3].classList[1];
            GAME_WON = true;
            flash_winner_text(i, true, false, false);
            return;
        }
        if(is_col_same_symbol(i, board)){
            WINNER = board[i].classList[1];
            GAME_WON = true;
            flash_winner_text(i, false, true, false);
            return;
        }
    }
    const diag_won = is_diag_same_symbol(board);
    if(diag_won !== ""){
        WINNER = board[4].classList[1];
        GAME_WON = true;
        if(diag_won === "left"){
            flash_winner_text(i, false, false, true);
        }
        else{
            flash_winner_text(i, false, false, false);
        }
        return;
    }
    
}

const is_row_same_symbol = (index, board) => {
    var lastSymbol = "";
    var row_start = index * 3
    for(var i = row_start; i < row_start + 3; i++){
        if(board[i].classList.length === 1) return;
        if (lastSymbol === "")
            lastSymbol = board[i].classList[1];
        else
            if(board[i].classList[1] != lastSymbol)
                return false;
    }
    return true;
}

const is_col_same_symbol = (index, board) => {
    var lastSymbol = "";
    for(var i = 0; i < 3; i ++){
        board_index = index + (i * 3);
        if(board[board_index].classList.length === 1) return;
        if(lastSymbol === ""){
            lastSymbol = board[board_index].classList[1];
        }
        else{
            if(board[board_index].classList[1] != lastSymbol)
                return false;
        }
    }
    return true;
}


const is_diag_same_symbol = (board) => {
    var lastSymbol = "";
    for(var i = 0; i < 9; i+=4){
        if(board[i].classList.length === 1) break;
        if(lastSymbol === ""){
            lastSymbol = board[i].classList[1];
        }
        else{
            if(board[i].classList[1] != lastSymbol)
                break;
            else{
                if(i === 8){
                    return "left";
                }
            }
        }
    }
    lastSymbol = "";
    for(var i = 2; i < 7; i+=2){
        if(board[i].classList.length === 1) break;
        if(lastSymbol === ""){
            lastSymbol = board[i].classList[1];
        }
        else{
            if(board[i].classList[1] != lastSymbol)
                return "";
            else{
                if(i === 6){
                    return "right";
                }
            }
        }
    }

    return "";
    
}


//event handlers 
const handleReset = (e) => {
    if(confirm('Are you sure you want to reset the game?')){
        resetGame();
        console.log("Reseted");
    }
}

const handleCellClick = (e) => {
    if (!GAME_STARTED){
        GAME_STARTED = true;
    }
    if(GAME_WON){
        return; 
    }
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
    checkWinner();
    updateStatusText();

    if(GAME_MODE === "SINGLE" && !X_NEXT){
        computerMakeMove();
    }

}


const handleGameModeClick = (e) => {
    if(GAME_STARTED){
        if(confirm('Are you sure you want to reset the game?')){
            resetGame();
        }
        else{
            return;
        }
    }
    const id = e.target.id;
    if(id === "single_player"){
        GAME_MODE = "SINGLE";
        X_NAME = "Your"
    }
    else{
        GAME_MODE = "DOUBLE";
        X_NAME = "X's";
    }
    updateGameModeText();
    updateStatusText();
}



const resetGame = () => {
    X_NEXT = true;
    GAME_WON = false;
    WINNER = "";
    create_grid_cells();
    updateGameModeText();
    updateStatusText();
    attachListeners();
}




resetGame();
