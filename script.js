const gridSize = 600;

const grid = document.querySelector(".container");

grid.style.width = `${gridSize}px`;
grid.style.height = `${gridSize}px`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(4, ${gridSize/4}px) / repeat(4, ${gridSize/4}px)`;

const arr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];


let ar = [1, 2, 3, 0];
// console.log(ar);
// console.log("last: ", ar.at(-1));
// ar.splice(0, 0, 0)
// console.log("hello", ar.slice(0, -1));

ar = [4, 4, 4, 0]; // actual: [2, 2, 0, 2]
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

// Make and populate grid based on 'arr'
for (let i = 0; i < 16; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);

    let squareSize = gridSize / 4.4;
    square.classList.add("square");
    square.id = "sq" + String(i);
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.style.boxSizing = "border-box";

    if(i === i1 || i === i2) {
        square.textContent = 2; //arr[Math.floor(i/4)][i%4];
        arr[Math.floor(i/4)][i%4] = 2;
    }
    else {
        square.textContent = 0;
        arr[Math.floor(i/4)][i%4] = 0;
    }
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

function handleKey(key) {
    if(key === "ArrowRight") {
        for(let i = 0; i < 4; i++) {
            arr[i] = computeRow(arr[i])
        }
    }
    else if(key === "ArrowLeft") {
        for(let i = 0; i < 4; i++) {
            arr[i] = mirrorRow(computeRow(mirrorRow(arr[i])));
        }   
    }
    else if(key === "ArrowUp") {
        for(let i = 0; i < 4; i++) {
            let upArr = [];
            for(let x = 0; x < 4; x++) {
                upArr.unshift(arr[x][i]);
            }
            upArr = computeRow(upArr);
            for(let x = 0; x < 4; x++) {
                arr[x][i] = upArr[-1*(x-3)];
            }
        }
    }
    else if(key === "ArrowDown") {
        for(let i = 0; i < 4; i++) {
            let upArr = [];
            for(let x = 0; x < 4; x++) {
                upArr.push(arr[x][i]);
            }
            upArr = computeRow(upArr);
            for(let x = 0; x < 4; x++) {
                arr[x][i] = upArr[x];
            }
        }
    }
    let index; 
    do {
        index = getRandomCell();
    }
    while(arr[Math.floor(index/4)][index%4] !== 0);
    
    arr[Math.floor(index/4)][index%4] = 2;
    updateGrid();
}

document.addEventListener("click", (e) => {
    //if (e.target.className === "square") e.target.classList.add("two");
});

document.addEventListener("keydown", (key) => handleKey(key.key));



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