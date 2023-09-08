document.addEventListener("DOMContentLoaded", function () {
    const welcomeContainer = document.getElementById("welcomeContainer");
    const gameContainer = document.getElementById("gameContainer");
    const startBtn = document.getElementById("startBtn");
    
    const board = document.getElementById("board");
    const generateBtn = document.getElementById("generateBtn");
    const checkBtn = document.getElementById("checkBtn");
    const solveBtn = document.getElementById("solveBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const messageBox = document.getElementById("messageBox");

    let boardEntries = []; // Declare the boardEntries array

    generateBtn.addEventListener("click", onGenerateClick);
    checkBtn.addEventListener("click", onCheckClick);
    solveBtn.addEventListener("click", onSolveClick);
    // acceptInputBtn.addEventListener("click", onAcceptInputClick);
    clearAllBtn.addEventListener("click", onClearAllClick);
    startBtn.addEventListener("click", onStartClick);
    
    function onStartClick() {
        welcomeContainer.style.display = "none";
        gameContainer.style.display = "block";
        boardEntries = createBoardEntries(); // Call createBoardEntries
        generateSudoku();
    }

    function onClearAllClick() {
        console.log("Clear All button clicked");
        clearBoard();
    }

    function createBoardEntries() {
        const entries = [];
        for (let row = 0; row < 9; row++) {
            const rowEntries = [];
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement("input");
                cell.type = "text";
                cell.className = "cell";
                cell.maxLength = 1;
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.value = "0"; // Initialize cell with zero
                rowEntries.push(cell);
                board.appendChild(cell);
            }
            entries.push(rowEntries);
        }
        return entries;
    }
    
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function onGenerateClick() {
        clearBoard();
        generateSudoku();
    }

    function clearBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                boardEntries[row][col].value = "0";
            }
        }

    }


    function generateSudoku() {
        clearBoard();
        // Initialize all cells with "0"
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                boardEntries[row][col].value = "0";
            }
        }
        // Fill more cells with random numbers (e.g., 40 cells)
        const totalFilledCells = 20;
        let filledCells = 0;
        while (filledCells < totalFilledCells) {
            const row = getRandomNumber(0, 8);
            const col = getRandomNumber(0, 8);
            const value = getRandomNumber(1, 9).toString();
            if (isValidMove(row, col, value)) {
                boardEntries[row][col].value = value;
                filledCells++;
            }
        }
    }
    
    

    function onAcceptInputClick() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                boardEntries[row][col].readOnly = false;
                boardEntries[row][col].addEventListener("click", onCellClick);
            }
        }
    }

    function onCellClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const inputValue = prompt(`Enter a number for cell at row ${row + 1}, column ${col + 1}:`, "");
    
        if (inputValue !== null) {
            if (!isValidInput(inputValue)) {
                showMessage("Please enter a valid number between 1 and 9.", false);
                return;
            }
    
            if (isValidMove(row, col, inputValue)) {
                cell.value = inputValue;
            } else {
                showMessage("Invalid move. This number already exists in the row, column, or grid.", false);
            }
        }
    }
    
    function isValidInput(input) {
        return /^[1-9]$/.test(input);
    }
    

    function onSolveClick() {
        if (solveSudoku()) {
            updateBoardUI();
            showMessage("SUDOKU SOLVED SUCCESSFULLY!", true);
        } else {
            showMessage("NO SOLUTION EXISTS FOR THE GIVEN SUDOKU.", false);
        }
    }

    function updateBoardUI() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                boardEntries[row][col].value = boardEntries[row][col].value;
            }
        }
    }

    function onCheckClick() {
        if (isBoardValid()) {
            showMessage("CONGRATULATIONS! THE SUDOKU PUZZLE IS SOLVED CORRECTLY.", true);
        } else {
            showMessage("OOPS! THE SUDOKU PUZZLE HAS ERRORS.", false);
        }
    }


    function isBoardValid() {
        // Check each row, column, and 3x3 grid for validity
        for (let i = 0; i < 9; i++) {
            if (!isValidGroup(getRow(i)) || !isValidGroup(getColumn(i)) || !isValidGroup(getGrid(i))) {
                return false;
            }
        }
        return true;
    }

    function isValidGroup(cells) {
        const filledValues = new Set();
        for (const cell of cells) {
            if (cell.value === "") continue;
            if (filledValues.has(cell.value)) {
                return false; // Duplicate value found in the group
            }
            filledValues.add(cell.value);
        }
        return true;
    }

    function getRow(rowIdx) {
        return boardEntries[rowIdx];
    }

    function getColumn(colIdx) {
        const column = [];
        for (let row = 0; row < 9; row++) {
            column.push(boardEntries[row][colIdx]);
        }
        return column;
    }

    function getGrid(gridIdx) {
        const grid = [];
        const startRow = Math.floor(gridIdx / 3) * 3;
        const startCol = (gridIdx % 3) * 3;
        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
                grid.push(boardEntries[row][col]);
            }
        }
        return grid;
    }

    function solveSudoku() {
        return solveCell(0, 0);
    }

    function solveSudoku() {
        return solveCell(0, 0);
    }
    
    function solveCell(row, col) {
        if (row === 9) {
            row = 0;
            col++;
            if (col === 9) {
                return true; // All cells filled
            }
        }
    
        if (boardEntries[row][col].value !== "0") {
            return solveCell(row + 1, col);
        }
    
        for (let num = 1; num <= 9; num++) {
            const value = num.toString();
            if (isValidMove(row, col, value)) {
                boardEntries[row][col].value = value;
                if (solveCell(row + 1, col)) {
                    return true;
                }
                boardEntries[row][col].value = "0"; // Backtrack
            }
        }
    
        return false;
    }
    

    function isValidMove(row, col, value) {
        return (
            !isValueInRow(row, value) &&
            !isValueInColumn(col, value) &&
            !isValueInGrid(row, col, value)
        );
    }

    function isValueInRow(row, value) {
        return boardEntries[row].some(cell => cell.value === value);
    }

    function isValueInColumn(col, value) {
        for (let row = 0; row < 9; row++) {
            if (boardEntries[row][col].value === value) {
                return true;
            }
        }
        return false;
    }

    function isValueInGrid(row, col, value) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (boardEntries[r][c].value === value) {
                    return true;
                }
            }
        }
        return false;
    }

    // Function to display messages in the message box
    function showMessage(message, isSuccess) {
        // const messageBox = document.getElementById("messageBox");
        messageBox.innerHTML = message;
        messageBox.style.color = isSuccess ? "#FFFFFF" : " #FFFFFF";
    }


});
