const gridSize = 600;

const grid = document.querySelector(".container");

grid.style.width = `${gridSize}px`;
grid.style.height = `${gridSize}px`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(4, ${gridSize/4}px) / repeat(4, ${gridSize/4}px)`;

const arr = [
    [2, 2, 2, 2], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0]
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
    // if(last === 0) {
    //     row.pop();
    //     row.unshift(0);
    //     last = row.at(-1);
    // }
    // if(last === ans.at(-1) && last !== lastEl) {
    //     ans.pop();
    //     last *= 2;
    //     ans.unshift(0);
    //     ans[ans.length-1] = last;
    //     ans.push(last);
    //     return ans;
    // } 
    ans.push(last);
    return ans;
}

console.log("computeRow: ", computeRow(ar));


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

    square.textContent = arr[Math.floor(i/4)][i%4];
}

document.addEventListener("click", (e) => {
    //if (e.target.className === "square") e.target.classList.add("two");
});

document.addEventListener("keydown", (key) => {
    //console.log(key.key);
});


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