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
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];


// Rudimentary test for computeRow:
// [2, 0, 0, 0] -> [0, 0, 0, 2] (try 2 at each spot)
// [2, 2, 0, 0] -> [0, 0, 0, 4]
// [2, 0, 2, 0] -> [0, 0, 0, 4]
// [2, 0, 0, 2] -> [0, 0, 0, 2]
// [0, 2, 2, 0] -> [0, 0, 0, 4]
// [0, 2, 0, 2] -> [0, 0, 0, 4]
// [0, 0, 2, 2] -> [0, 0, 0, 4]
// [0, 4, 2, 2] -> [0, 0, 4, 4]
// [0, 2, 2, 4] -> [0, 0, 4, 4]
// [4, 2, 0, 2] -> [0, 0, 4, 4]
// [4, 4, 2, 8] -> [0, 8, 2, 8]

const squares = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

const cells = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];

const cells2 = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
];
let mov = [0, 0, 0];

let c1, c2, c3;
c1 = c2 = c3 = 0;

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
let rowOneLess;


// Compute the array
function computeRow(row, n, whichTime, direction) {
    if(row.length === 2) return row; // stop condition
    //cell to move is [whichTime][]
    if(row.every(e => e === 0)) return row;
    let i = row.length-1;

    while(row.at(-1) === 0 && i >= 0) {  
        row.pop();
        row.unshift(0);
        i--;

        for(let g = 0; g < n-1-c1; g++)
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

    rowOneLess = row.slice(0, -1);
    i = rowOneLess.length-1;
    while(rowOneLess.at(-1) === 0 && i >= 0 && (rowOneLess[0] || rowOneLess[1])) {
        rowOneLess.pop();   
        rowOneLess.unshift(0);
        i--;

        for(let h = 0; h < n-1-c1-c2; h++) {
            mov[h]++;
        }
        c2++;
    }
    row = [...rowOneLess, row[3]];

    let last = row.at(-1);
    for(let x = 0; x < n-1; x++) {
        if(x === 2 && c3 === 0) rowOneLess.pop();
        if(last === rowOneLess.at(-1) && last !== 0) {
            last *= 2;
            if(last === 2048) {
                displayMessage("You Won!");
                over = true;
            }
            row.splice(-1-x, 1);
            row.unshift(0);
            row[n-1-x] = last;
            // row = rowOneLess;
            rowOneLess = row.slice(0, -1);

            if(rowOneLess.at(-2) !== 0 && rowOneLess.at(-1) === 0) {
                rowOneLess.pop();   
                rowOneLess.unshift(0);
                i--;
        
                for(let h = 0; h < 2; h++) {
                    mov[h]++;
                }
                
            }
            row = [...rowOneLess, row[n-1]];


            //Math.max(0, whichComputeRow-c1-c2)
            for(let h = 0; h < 3-c1-c2-c3-x; h++) {
                mov[h]++;
                //mov[2-c1-c2]++;
            }
            c3++;
        }
        else if(rowOneLess.at(-2) === 0 && rowOneLess.at(-1) !== 0 && rowOneLess[0] && rowOneLess.length === 3) {
            if(rowOneLess[0] !== 0) {
                rowOneLess.splice(-2, 1);   
                rowOneLess.unshift(0);
                i--;
        
                for(let h = 0; h < 2; h++) {
                    mov[h]++;
                }
                row = [...rowOneLess, row[n-1]];
            }
        }
        last = rowOneLess.at(-2-x);
    }    
    // let ans;
    // whichComputeRow++;
    // ans = computeRow(rowOneLess, last);
    // ans.push(last);
    // if(c1+c2+c3 === 0) { 
    //     computeRow(rowOneLess, 3);
    // }
    return row;
}

function wipeMov() {
    for(let i=0; i<3; i++)
        mov[i] = 0;
    whichComputeRow = 0;
}

function changeMov(forMov, mov) {
    for(let i = 0; i < mov.length; i++) {
        forMov[i] === 0 ? mov[i] = 0 : true;
    }
}

function computeRowBasedOnKey(key, array) {
    let same = true;
    if(key === "ArrowRight") {
        for(let i = 0; i < 4; i++) {
            let forMov = array[i].slice(0, -1);
            let temp = computeRow(array[i], 4);
            //if (c3 && c2+c1 === 0) mov[2] =0;
            c1 = c2 = c3 = 0;
            changeMov(forMov, mov);
            for(let x = 2; x >= 0; x--) {
                if(mov[x] !== 0) {
                    translateCell(cells2[i][x], key, mov[x]);
                    if(cells2[i][x+mov[x]] !== null) {
                        cells2[i][x].textContent *= 2;
                        cells2[i][x].style.backgroundColor = backgroundColors[(Math.log(cells2[i][x].textContent) / Math.log(2))];
                        document.body.removeChild(cells2[i][x+mov[x]]);
                        cells2[i][x+mov[x]].remove();
                    }
                    // change its parent
                    // squares[i][x].removeChild(cells2[i][x]);
                    // squares[i][x+mov[x]].appendChild(cells2[i][x]);

                    cells2[i][x+mov[x]] = cells2[i][x];
                    cells2[i][x] = null;
                }
            }
            wipeMov();
            // check for each row being the same; for game-over condition
            if(JSON.stringify(array[i]) !== JSON.stringify(temp)) same = false;
            array[i] = temp;
        }
    }
    else if(key === "ArrowLeft") {
        for(let i = 0; i < 4; i++) {
            let forMov = mirrorRow(array[i]).slice(0, -1);
            let temp = mirrorRow(computeRow(mirrorRow(array[i]), 4));
            c1 = c2 = c3 = 0;
            changeMov(forMov, mov);
            mov = mirrorRow(mov);
            for(let x = 1; x < 4; x++) {
                if(mov[x-1] !== 0) {
                    translateCell(cells2[i][x], key, mov[x-1]);
                    if(cells2[i][x-mov[x-1]] !== null) {
                        cells2[i][x].textContent *= 2;
                        cells2[i][x].style.backgroundColor = backgroundColors[(Math.log(cells2[i][x].textContent) / Math.log(2))];
                        document.body.removeChild(cells2[i][x-mov[x-1]]);
                        cells2[i][x-mov[x-1]].remove();
                    }
                    // change its parent
                    // squares[i][x].removeChild(cells2[i][x]);
                    // squares[i][x-mov[x-1]].appendChild(cells2[i][x]);

                    cells2[i][x-mov[x-1]] = cells2[i][x];
                    cells2[i][x] = null;
                }
            }
            
            
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
            let temp = upArr.slice();
            forMov = temp.slice(0, -1);
            let comp = [];
            upArr = computeRow(upArr, 4);
            c1 = c2 = c3 = 0;
            changeMov(forMov, mov);
            for(let x = 1; x < 4; x++) {
                if(mov[3-x] !== 0) {
                    translateCell(cells2[x][i], key, mov[3-x]);
                    if(cells2[x-mov[3-x]][i] !== null) {
                        cells2[x][i].textContent *= 2;
                        cells2[x][i].style.backgroundColor = backgroundColors[(Math.log(cells2[x][i].textContent) / Math.log(2))];
                        document.body.removeChild(cells2[x-mov[3-x]][i]);
                        cells2[x-mov[3-x]][i].remove();
                    }
                    // change its parent
                    // squares[x][i].removeChild(cells2[x][i]);
                    // squares[x-mov[3-x]][i].appendChild(cells2[x][i]);

                    cells2[x-mov[3-x]][i] = cells2[x][i];
                    cells2[x][i] = null;
                }
            }
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
            let temp = upArr.slice();
            forMov = temp.slice(0, -1);
            let comp = [];
            upArr = computeRow(upArr, 4);

            c1 = c2 = c3 = 0;
            changeMov(forMov, mov);
            for(let x = 2; x >= 0; x--) {
                if(mov[x] !== 0) {
                    translateCell(cells2[x][i], key, mov[x]);
                    if(cells2[x+mov[x]][i] !== null) {
                        cells2[x][i].textContent *= 2;
                        cells2[x][i].style.backgroundColor = backgroundColors[(Math.log(cells2[x][i].textContent) / Math.log(2))];
                        document.body.removeChild(cells2[x+mov[x]][i]);
                        cells2[x+mov[x]][i].remove();
                    }
                    // change its parent
                    // squares[x][i].removeChild(cells2[x][i]);
                    // squares[x+mov[x]][i].appendChild(cells2[x][i]);

                    cells2[x+mov[x]][i] = cells2[x][i];
                    cells2[x][i] = null;
                }
            }

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
    let len = arr.length;
    let ans = new Array(len);
    for(let i = 0; i < len; i++) 
        ans[i] = arr[len-1-i];
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
    positionX = moveCellRect.left - zeroX;
    positionY = moveCellRect.top - zeroY;

    console.log("posX and posY", positionX, positionY);
    if(directions[direction]) {
        positionX = count*directions[direction][0];
        positionY = count*directions[direction][1];
    }

    const style = window.getComputedStyle(moveCell);
    const matrix = new DOMMatrix(style.transform);

    // Extract current translateX and add 150px
    const currentX = matrix.m41; // m41 is translateX
    const currentY = matrix.m42;

    const newX = currentX + count*directions[direction][0];
    const newY = currentY + count*directions[direction][1]

    // Apply new transform
    // element.style.transform = `translateX(${newX}px)`;


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
    // // `);
    // console.log("translatex: ", window.getComputedStyle(moveCell).transform.m41); // get translatex
    // console.log("translatey: ", window.getComputedStyle(moveCell).transform.m42); // get translatex
    
    
    //console.log("somehting", placehold.getBoundingClientRect().left);
    moveCell.style.transform = `translate(${newX}px, ${newY}px)`;
    //console.log("somehting", placehold.getBoundingClientRect().left);

    

    // setTimeout(() => {
    //     console.log("after 1000");
    //     moveCell.style.transition = "transform 0s";
    //     moveCell.style.transform = `translate(0px, 0px)`;
    //     moveCell.style.left = `${zeroX+newX}px`;
    //     moveCell.style.top = `${zeroY+newY}px`;
    //     setTimeout(() => {
    //         moveCell.style.transition = "transform 0.4s ease-in-out";
    //     }, 1800);
    //     console.log("rect.left: ", moveCell.getBoundingClientRect().left);
    //     console.log("newX: ", zeroX+newX);
    //   //  two.style.gridColumn = 0;
    // }, 500);

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

        squares[Math.floor(i/4)][i%4] = square;
    
        square.classList.add("square");
        square.id = "sq" + String(i);
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.boxSizing = "border-box";

        if(i === 0) {
            const sqRect = square.getBoundingClientRect();
            zeroX = sqRect.left;
            zeroY = sqRect.top;
        }

        const sqRec = square.getBoundingClientRect();
    
        // To populate based on arr:
        //square.textContent = ;

        // Create absolute-positioned divs that go on top of the cells and house the numbers
    
        if(arr[Math.floor(i/4)][i%4] !== 0) { //(i === i1 || i === i2) {
            const twoCell = document.createElement("div");
            document.body.appendChild(twoCell);
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
                position: absolute;
                left: ${sqRec.left}px;
                top: ${sqRec.top}px;
                `);

            cells2[Math.floor(i/4)][i%4] = twoCell;

            twoCell.textContent = arr[Math.floor(i/4)][i%4]; //arr[Math.floor(i/4)][i%4];
            //arr[Math.floor(i/4)][i%4] = 2;
            twoCell.style.backgroundColor = backgroundColors[1];

            twoCell.style.width = `${gridSize/4.4}px`;
            twoCell.style.height = `${gridSize/4.4}px`;
        }
        // else {
        //     square.textContent = 0;
        //     arr[Math.floor(i/4)][i%4] = 0;
        // }
    }
}

// Input
function handleKey(key) {
    console.log("zeroX", zeroX);
    computeRowBasedOnKey(key, arr);
    let index; 
    let arr_copy = new Array(4);
    // for(let i = 0; i < 4; i++) {
    //     arr_copy[i] = arr[i];
    // }
    // console.log(arr_copy);

    let same = [false, false, false, false];

    setTimeout(() => {
        // add a new 2 only if there is at least one empty cell
        if((arr[0].includes(0) || arr[1].includes(0) || arr[2].includes(0) || arr[3].includes(0))) {
            do {
                index = getRandomCell();
            }
            while(arr[Math.floor(index/4)][index%4] !== 0);

            arr[Math.floor(index/4)][index%4] = 2;

            const newCell = document.createElement("div");
            document.body.appendChild(newCell);

            const sqRec = squares[Math.floor(index/4)][index%4].getBoundingClientRect();

            newCell.setAttribute("style", `
                position: absolute;
                left: ${sqRec.left}px;
                top: ${sqRec.top}px;
                `);

            newCell.classList.add("cell");
            newCell.textContent = 2;
            
            newCell.style.backgroundColor = "red";
            newCell.style.width = `${600/4.4-40}px`;
            newCell.style.height = `${600/4.4-40}px`;
            setTimeout(() => {
                newCell.style.width = `${600/4.4}px`;
                newCell.style.height = `${600/4.4}px`;
            }, 100);
            setTimeout(() => {
                newCell.style.backgroundColor = backgroundColors[1];
            }, 200);
            

            // set z-index higher than other children so it's visible
            // const numChildren = lastsquares[Math.floor(index/4)][index%4].childElementCount;
            // newCell.style.zIndex = `${numChildren}`;

            cells2[Math.floor(index/4)][index%4] = newCell;
        }
        // Check for game over
        if(!(arr[0].includes(0) || arr[1].includes(0) || arr[2].includes(0) || arr[3].includes(0))) {
            for(let i = 0; i < 4; i++) {
                arr_copy[i] = arr[i];
            }
            let i = 0;
            keys.forEach((k) => {
                console.log("entered");
                same[i] = computeRowBasedOnKey(k, arr_copy);
                i++;
            });
            if(same.every(bool => bool === true) && !over) { // GAME OVER
                console.log("game over");
                // const button = document.createElement("button");
                // btn.appendChild(button);
                // button.textContent = "Start Over";
                
                displayMessage("Game Over!");
                over = true;
            }
        }
    }, 100);

    
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