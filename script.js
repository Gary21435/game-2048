const gridSize = 600;

const grid = document.querySelector(".container");

grid.style.width = `${gridSize}px`;
grid.style.height = `${gridSize}px`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(4, ${gridSize/4}px) / repeat(4, ${gridSize/4}px)`;

const arr = [
    [1, 2, 3, 4, 5], 
    [6, 7, 8, 9, 10], 
    [1, 2, 3, 4, 5], 
    [6, 7, 8, 9, 10]
];

console.log(arr[1][1]);

for (let i = 0; i < 16; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);

    let squareSize = gridSize / 4.4;
    square.classList.add("square");
    square.id = "sq" + String(i);
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.style.boxSizing = "border-box";

    square.textContent = "2";
}

document.addEventListener("click", (e) => {
    e.target.classList.add("two");
});