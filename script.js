const gridSize = 600;
const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
const grid = document.querySelector(".container");
const btn = document.querySelector(".btn");
const gameOver = document.querySelector(".game-over");
let over = false;

grid.style.width = `${gridSize}px`;
grid.style.height = `${gridSize}px`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(4, ${gridSize/4}px) / repeat(4, ${gridSize/4}px)`;

const arr = [
    [8, 2, 16, 2],
    [16, 4, 8, 256],
    [4, 64, 8, 2],
    [2, 8, 2, 64],
];


function displayMessage(msg) { // SMTH EXTRA HAPPENS WHEN YOU HIT NEW GAME AFTER WINNING
    const rect = grid.getBoundingClientRect();
            // console.log("rect.top: ", rect.top);
            // console.log("rect.width: ", rect.width);
            
    const overlay = document.createElement("div");
            overlay.textContent = msg;
            overlay.classList.add("overlay");
            overlay.setAttribute("style", `
                position:absolute; 
                top: ${rect.top}px; 
                left: ${rect.left}px; 
                width: ${rect.width}px;
                height: ${rect.height}px    
            `);
            document.body.appendChild(overlay);
}

// let ar = [1, 2, 3, 0];
// // console.log(ar);
// // console.log("last: ", ar.at(-1));
// // ar.splice(0, 0, 0)
// // console.log("hello", ar.slice(0, -1));

// ar = [4, 4, 4, 0]; // actual: [2, 2, 0, 2]
function computeRow(row) {
    if(row.length === 1) return row; // stop condition

    let i = row.length-1;
    while(row.at(-1) === 0 && i >= 0) {
        row.pop();
        row.unshift(0);
        i--;
    }

    let rowOneLess = row.slice(0, -1);
    i = rowOneLess.length-1;
    while(rowOneLess.at(-1) === 0 && i >= 0) {
        rowOneLess.pop();   
        rowOneLess.unshift(0);
        i--;
    }

    let last = row.at(-1);
    if(last === rowOneLess.at(-1) && last !== 0) {
        last *= 2;
        if(last === 2048) {
            displayMessage("You Won!");
            over = true;
        }
        rowOneLess.unshift(0);
        rowOneLess[rowOneLess.length-1] = last;
        row = rowOneLess;
        rowOneLess = row.slice(0, -1);
    }
    let ans;
    ans = computeRow(rowOneLess, last);
    ans.push(last);
    return ans;
}

function getRandomCell() {
    return Math.floor(Math.random()*16);
}

let i1 = getRandomCell();
console.log(i1);
let i2;
while(i1 === (i2 = getRandomCell()));
console.log(i2);

// Make and populate grid; insert two
function populateGrid() {
    for (let i = 0; i < 16; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
    
        let squareSize = gridSize / 4.4;
        square.classList.add("square");
        square.id = "sq" + String(i);
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.boxSizing = "border-box";
    
        // To populate based on arr:
        // square.textContent = arr[Math.floor(i/4)][i%4];
    
        if(i === i1 || i === i2) {
            square.textContent = 2; //arr[Math.floor(i/4)][i%4];
            arr[Math.floor(i/4)][i%4] = 2;
        }
        else {
            square.textContent = 0;
            arr[Math.floor(i/4)][i%4] = 0;
        }
    }
}

populateGrid();

function startOver() {
    over = false;
    let i1 = getRandomCell();
    console.log(i1);
    let i2;
    while(i1 === (i2 = getRandomCell()));
    console.log(i2);
    
    // Select all cells
    const allCells = document.querySelectorAll(".container>div");
    let i = 0;
    allCells.forEach(e => {
        if(i === i1 || i === i2) {
            e.textContent = 2; //arr[Math.floor(i/4)][i%4];
            arr[Math.floor(i/4)][i%4] = 2;
        }
        else {
            e.textContent = 0;
            arr[Math.floor(i/4)][i%4] = 0;
        }
        i++;
    })
}

function updateGrid() {
    let i = 0;
    while(i < 16) {
        let square = document.querySelector(`#sq${String(i)}`)
        square.textContent = arr[Math.floor(i/4)][i%4];
        i++;
    }
}

function mirrorRow(arr) {
    let ans = new Array(4);
    ans[0] = arr[3];
    ans[1] = arr[2];
    ans[2] = arr[1];
    ans[3] = arr[0];
    return ans;
}

function computeRowBasedOnKey(key, array) {
    let same = true;
    if(key === "ArrowRight") {
        for(let i = 0; i < 4; i++) {
            let temp = computeRow(array[i]);
            // check for each row being the same
            if(JSON.stringify(array[i]) !== JSON.stringify(temp)) same = false;
            array[i] = temp;
        }
    }
    else if(key === "ArrowLeft") {
        for(let i = 0; i < 4; i++) {
            let temp = mirrorRow(computeRow(mirrorRow(array[i])));
            if(JSON.stringify(array[i]) !== JSON.stringify(temp)) same = false;
            array[i] = temp;
        }   
    }
    else if(key === "ArrowUp") {
        for(let i = 0; i < 4; i++) {
            let upArr = [];
            for(let x = 0; x < 4; x++) {
                upArr.unshift(array[x][i]);
            }
            let temp = upArr;
            let comp = [];
            upArr = computeRow(upArr);
            for(let x = 0; x < 4; x++) {
                array[x][i] = upArr[-1*(x-3)];
                comp.unshift(array[x][i]);
            }
            if(JSON.stringify(temp) !== JSON.stringify(comp)) same = false;
        }
    }
    else if(key === "ArrowDown") {
        for(let i = 0; i < 4; i++) {
            let upArr = [];
            for(let x = 0; x < 4; x++) {
                upArr.push(array[x][i]);
            }
            let temp = upArr;
            let comp = [];
            upArr = computeRow(upArr);
            for(let x = 0; x < 4; x++) {
                array[x][i] = upArr[x];
                comp.push(array[x][i]);
            }
            if(JSON.stringify(temp) !== JSON.stringify(comp)) same = false;
        }
    }
    return same;
}

function handleKey(key) {
    computeRowBasedOnKey(key, arr);
    let index; 
    let arr_copy = new Array(4);
    // for(let i = 0; i < 4; i++) {
    //     arr_copy[i] = arr[i];
    // }
    // console.log(arr_copy);

    let same = [false, false, false, false];
    // add a new 2 only if there is at least one empty cell
    if((arr[0].includes(0) || arr[1].includes(0) || arr[2].includes(0) || arr[3].includes(0))) {
        do {
            index = getRandomCell();
        }
        while(arr[Math.floor(index/4)][index%4] !== 0);

        arr[Math.floor(index/4)][index%4] = 2;
    }
    // Check for game over
    else {
        for(let i = 0; i < 4; i++) {
            arr_copy[i] = arr[i];
        }
        let i = 0;
        keys.forEach((k) => {
            console.log("entered");
            same[i] = computeRowBasedOnKey(k, arr_copy);
            i++;
        });
        if(same.every(bool => bool === true && !over)) { // GAME OVER
            console.log("game over");
            // const button = document.createElement("button");
            // btn.appendChild(button);
            // button.textContent = "Start Over";
            
            displayMessage("Game Over!");
            over = true;
        }
    }
    updateGrid();
}

document.addEventListener("click", (e) => {
    //if (e.target.className === "square") e.target.classList.add("two");
});



document.addEventListener("keydown", (key) => {
    if(keys.includes(key.key) && !over) handleKey(key.key);
});

document.addEventListener("click", (e) => {
    if(e.target.classList.contains("new-game"))
        startOver();
});


//OLD IMPLEMENTATION (doesn't work)
// function computeRow(row) {
//     if(row.length === 1) return row; // stop condition

//     let last = row.at(-1);
//     let rowOneLess = computeRow(row.slice(0, -1));

//     if(last === 0) {
//         rowOneLess.splice(0, 0, 0);
//         return rowOneLess;
//     }
//     else if(last === rowOneLess.at(-1)) {
//         rowOneLess.splice(rowOneLess.length-1, 1, 0);
//         last *= 2;
//         rowOneLess.splice(0, 0, 0);
//         rowOneLess[rowOneLess.length-1] = last;
//         return rowOneLess;
//     }
//     else {
//         rowOneLess.push(last);
//         return rowOneLess;
//     }
// }