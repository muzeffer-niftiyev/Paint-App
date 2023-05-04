const appContainer = document.querySelector(".container");
const squareShape = document.querySelector("#square");
const triangleShape = document.querySelector("#triangle");
const circleShape = document.querySelector("#circle");

const eraseBtn = document.querySelector(".erase-btn");
const brushBtn = document.querySelector(".brush-btn");
const eraseImg = document.querySelector("#erase-img");
const brushImg = document.querySelector("#brush-img");
brushImg.src = "brush-active.svg";
const buttons = document.querySelectorAll(".btn");

const clearPageBtn = document.querySelector(".clear-all");
const saveBtn = document.querySelector(".save");

const boldSize = document.querySelector(".set-boldness");
const canvas = document.querySelector("canvas");
const board = canvas.getContext("2d");

const colorBtns = document.querySelectorAll(".default-colors");
const colorPicker = document.querySelector(".set-color");

let isDrawing = false;
let brushWidth = 5;
let prevX, prevY, snapshot;
let selectedTool = "brush";
let selectedColor = "#000";


const setBackground = function(){
    board.fillStyle = '#fff';
    board.fillRect(0, 0, canvas.width, canvas.height);
    board.fillStyle = selectedColor;
}

eraseBtn.addEventListener("mouseenter", function () {
  eraseImg.src = "eraser-active.png";
});
eraseBtn.addEventListener("mouseleave", function () {
  eraseImg.src = "eraser.png";
});
eraseBtn.addEventListener("click", function () {
  eraseImg.src = "eraser-active.png";
});

brushBtn.addEventListener("mouseenter", function () {
  brushImg.src = "brush-active.svg";
});
brushBtn.addEventListener("mouseleave", function () {
  brushImg.src = "brush.svg";
});
brushBtn.addEventListener("click", function () {
  brushImg.src = "brush-active.svg";
});

window.addEventListener("load", () => {
    setBackground()
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const draw = (e) => {
  if (!isDrawing) return;

  board.putImageData(snapshot, 0, 0);
  if (selectedTool === "brush" || selectedTool === "erase") {
    board.strokeStyle = selectedTool === "erase" ? "#fff" : selectedColor;
    board.lineTo(e.offsetX, e.offsetY);
    board.stroke();
  }
  if (selectedTool === "square") {
    board.strokeRect(
      e.offsetX,
      e.offsetY,
      prevX - e.offsetX,
      prevY - e.offsetY
    );
  }
  if (selectedTool === "circle") {
    board.beginPath();
    let radius = Math.sqrt(
      Math.pow(prevX - e.offsetX, 2) + Math.pow(prevY - e.offsetY, 2)
    );
    board.arc(prevX, prevY, radius, 0, 2 * Math.PI);
    board.stroke();
  }
  if (selectedTool === "triangle") {
    board.beginPath();
    board.moveTo(prevX, prevY);
    board.lineTo(e.offsetX, e.offsetY);
    board.lineTo(prevX * 2 - e.offsetX, e.offsetY);
    board.closePath();
    board.stroke();
  }
};

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  board.beginPath();
  prevX = e.offsetX;
  prevY = e.offsetY;
  board.strokeStyle = selectedColor;
  board.fillStyle = selectedColor;
  board.lineWidth = brushWidth;
  snapshot = board.getImageData(0, 0, canvas.width, canvas.height);
});
canvas.addEventListener("mouseup", () => (isDrawing = false));

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedTool = btn.id;

    if (btn.id === "erase") {
      eraseBtn.addEventListener("mouseleave", function () {
        eraseImg.src = "eraser-active.png";
        brushImg.src = "brush.svg";
      });
    } else {
      eraseImg.src = "eraser.png";
    }

    if (btn.id === "brush") {
      brushBtn.addEventListener("mouseleave", function () {
        brushImg.src = "brush-active.svg";
        eraseImg.src = "eraser.png";
      });
    } else {
      brushImg.src = "brush.svg";
    }
  });
});

boldSize.addEventListener("change", () => (brushWidth = boldSize.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (!e.target.classList.contains("color")) return;
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    selectedColor = window
      .getComputedStyle(e.target)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  selectedColor = colorPicker.value;
});

clearPageBtn.addEventListener("click", function () {
  board.clearRect(0, 0, canvas.width, canvas.height);
  setBackground()
});

saveBtn.addEventListener('click', function(){
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})
