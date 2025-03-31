const gridSize = 600;
let squareSize = gridSize / 4.4;
const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
const grid = document.querySelector(".container");
const btn = document.querySelector(".btn");
const gameOver = document.querySelector(".game-over");
let over = false;

let zeroX, zeroY;
let whichComputeRow = 0;

const backgroundColors = ["#CCC1B4", "#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f", 
                          "#f65e3b", "#edcf72", "#edcc61", "#edc850", "#edc850", "#edc850"];

const emptybackground = "#CCC1B4";
const sixteenColor = "#f9f6f2";

grid.style.width = `${gridSize}px`;
grid.style.height = `${gridSize}px`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(4, ${gridSize/4}px) / repeat(4, ${gridSize/4}px)`;

const arr = [
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const cells = [];
let mov = [0, 0, 0];

let c1, c2;
c1 = c2 = 0;

// for(let i = 0; i < 4; i++) {
//     const tempArr = new Array(4);
//     for(let j = 0; j < 4; j++) {
//         tempArr[j] = `obj${i}${j}`;        
//     }
//     mov.push(tempArr);
// }
// console.log("mov: ", mov);


let i1 = getRandomCell();
console.log(i1);
let i2;
while(i1 === (i2 = getRandomCell()));
console.log(i2);

populateGrid(); // populate grid and put 2's at i1 and i2

console.log(cells)

const two = document.querySelector("div.cell");

let positionX = 0;
let positionY = 0;

// demonstration of universality of computeRow function (works for any dimension of grid)
// let arr1 = [2, 4, 4, 2, 4, 4, 2, 2];
// console.log(computeRow(arr1));

/* -----------------------------------------FUNCTIONS------------------------------------------- */

// Compute the array
function computeRow(row, whichTime, direction) {
    if(row.length === 2) return row; // stop condition
    //cell to move is [whichTime][]
    if(row.every(e => e === 0)) return row;
    let i = row.length-1;

    while(row.at(-1) === 0 && i >= 0) {  
        row.pop();
        row.unshift(0);
        i--;

        for(let g = 0; g < 3-c1; g++)
            mov[g]++;

        c1++;
    }
    // if(c1 > 0) {
    //     mov = mov.map(e => e+1);
    //     for(let g = 0; g < 3-whichComputeRow; g++) {
    //         console.log("c1-g: ",c1-g);
    //         mov[g] += Math.max(c1 - g, 1);
    //     }
    // }
    
    // computeRow will call translateCell(cells[i][j], direction, count)

    let rowOneLess = row.slice(0, -1);
    i = rowOneLess.length-1;
    while(rowOneLess.at(-1) === 0 && i >= 0 && (rowOneLess[0] || rowOneLess[1])) {
        rowOneLess.pop();   
        rowOneLess.unshift(0);
        i--;
        c2++;
    }
    if(c2 > 0)
        for(let h = 0; h < 3-whichComputeRow-c1; h++) {
            mov[h] += Math.max(c2 - j, 1);
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
        
        if(c2 > 0)
            for(let k = 0; k < 3-whichComputeRow-c1-c2; k++) {
                mov[k]++;
            }
    }
    let ans;
    whichComputeRow++;
    ans = computeRow(rowOneLess, last);
    ans.push(last);
    return ans;
}

function wipeMov() {
    for(let i=0; i<4; i++)
        mov[i] = 0;
    whichComputeRow = 0;
}

function computeRowBasedOnKey(key, array) {
    let same = true;
    if(key === "ArrowRight") {
        for(let i = 0; i < 4; i++) {
            let temp = computeRow(array[i], i);
            
            for(let u = 0; u < 3; u++) {
                let objMove;
                if(objMove = cells.find(obj => obj.c[0] === i && obj.c[1] === u)) {
                    let mov_i = mov[Math.min(2, i)];
                    translateCell(objMove.it, key, mov_i);
                    objMove.c[1] += mov_i;
                }
            }

            wipeMov();
            // check for each row being the same
            if(JSON.stringify(array[i]) !== JSON.stringify(temp)) same = false;
            array[i] = temp;
        }
    }
    else if(key === "ArrowLeft") {
        for(let i = 0; i < 4; i++) {
            let temp = mirrorRow(computeRow(mirrorRow(array[i]), i));
            wipeMov();
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
            upArr = computeRow(upArr, i);
            wipeMov();
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
            upArr = computeRow(upArr, i);
            wipeMov();
            for(let x = 0; x < 4; x++) {
                array[x][i] = upArr[x];
                comp.push(array[x][i]);
            }
            if(JSON.stringify(temp) !== JSON.stringify(comp)) same = false;
        }
    }
    return same;
}

// Helper functions
function mirrorRow(arr) {
    let ans = new Array(4);
    ans[0] = arr[3];
    ans[1] = arr[2];
    ans[2] = arr[1];
    ans[3] = arr[0];
    return ans;
}

function getRandomCell() {
    return Math.floor(Math.random()*16);
}


// UI-related functions
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

const directions = {
    ArrowLeft: [-150, 0],
    ArrowRight: [150, 0],
    ArrowUp: [0, -150],
    ArrowDown: [0, 150]
};

function translateCell(moveCell, direction, count) {
    let moveCellRect = moveCell.getBoundingClientRect();
    positionX = moveCellRect.left;
    positionY = moveCellRect.top;

    console.log(directions[direction]);
    if(directions[direction]) {
        positionX = count*directions[direction][0];
        positionY = count*directions[direction][1];
    }
    // const placehold = document.createElement("div");
    // two.appendChild(placehold);
    // placehold.classList.add("square");
    // placehold.id = "sq01";
    // placehold.style.width = `${squareSize}px`;
    // placehold.style.height = `${squareSize}px`;
    // placehold.style.boxSizing = "border-box";
    // placehold.textContent = 2;
    // placehold.style.transition = "transform 5s";
    // let reect = two.getBoundingClientRect();
    // placehold.setAttribute("style", `
    //     position:absolute; 
    //     top: ${reect.top}px; 
    //     left: ${reect.left}px; 
    //     width: ${reect.width}px;
    //     height: ${reect.height}px    
    // `);
    
    
    //console.log("somehting", placehold.getBoundingClientRect().left);
    moveCell.style.transform = `translate(${positionX}px, ${positionY}px)`;
    //console.log("somehting", placehold.getBoundingClientRect().left);
    setTimeout(() => {
        console.log("after 1000");

      //  two.style.gridColumn = 0;
    }, 1500);

    console.log("run!");
}

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
        let numSq = arr[Math.floor(i/4)][i%4];
        square.textContent = numSq;
        if(numSq === 0) {
            square.style.backgroundColor = backgroundColors[0];
            square.style.color = "#4e453e";
        }
        else {
            if(numSq > 4) square.style.color = "white";
            else square.style.color = "#4e453e"
            square.style.backgroundColor = backgroundColors[(Math.log(numSq) / Math.log(2))];
        }
        i++;
    }
}

function populateGrid() { // Make and populate grid; insert two
    for (let i = 0; i < 16; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
    
        square.classList.add("square");
        square.id = "sq" + String(i);
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.boxSizing = "border-box";

        const sqRect = square.getBoundingClientRect();
        zeroX = sqRect.left;
        zeroY = sqRect.top;
    
        // To populate based on arr:
        //square.textContent = ;

        // Create absolute-positioned divs that go on top of the cells and house the numbers
    
        if(arr[Math.floor(i/4)][i%4] === 2 || arr[Math.floor(i/4)][i%4] === 4) { //(i === i1 || i === i2) {
            const twoCell = document.createElement("div");
            square.appendChild(twoCell);
            twoCell.classList.add("cell");
            // console.log("two left: ", twoCell.getBoundingClientRect().left);
            // console.log("two top: ", twoCell.getBoundingClientRect().top);
            // const posSq = square.getBoundingClientRect();

            cells.push({
                it: twoCell,
                num: arr[Math.floor(i/4)][i%4],
                x: zeroX,
                y: zeroY,
                c: [Math.floor(i/4), i%4]
            });

            twoCell.setAttribute("style", `
                position: relative;
                `);

            twoCell.textContent = arr[Math.floor(i/4)][i%4]; //arr[Math.floor(i/4)][i%4];
            //arr[Math.floor(i/4)][i%4] = 2;
            twoCell.style.backgroundColor = backgroundColors[1];
        }
        // else {
        //     square.textContent = 0;
        //     arr[Math.floor(i/4)][i%4] = 0;
        // }
    }
}

// Input
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
        // do {
        //     index = getRandomCell();
        // }
        // while(arr[Math.floor(index/4)][index%4] !== 0);

        // arr[Math.floor(index/4)][index%4] = 2;
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
    //updateGrid();
}

// EVENT LISTENERS

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

// document.addEventListener("keydown", (e) => {
//     translateCell(e.key);
// });




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