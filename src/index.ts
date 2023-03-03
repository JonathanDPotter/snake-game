import Snake, { SNAKE_SPEED } from "./objects/snake";
import Food from "./objects/food";
import "./style.scss";
import { outsideGrid } from "./utils/grid";

export interface Coords {
  x: number;
  y: number;
}

enum GameState {
  menu = "menu",
  running = "running",
  over = "over",
}

let lastRenderTime: number = 0;
const snake = new Snake();
const food = new Food();
const gameBoard: HTMLElement = document.getElementById("game-board")!;
const menu: HTMLElement = document.getElementById("menu")!;
const gameOverMessage: HTMLElement = document.getElementById("game-over")!;
let gameState: GameState = GameState.menu;

function main(currentTime: number) {
  window.requestAnimationFrame(main);

  switch (gameState) {
    case GameState.menu:
      menu.classList.add("show");
      break;
    case GameState.running:
      const secondsSinceLastRender: number =
        (currentTime - lastRenderTime) / 1000;

      if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

      lastRenderTime = currentTime;
      update();
      draw();
      break;
    case GameState.over:
      gameOverMessage.classList.add("show");
      break;

    default:
      break;
  }
}

window.requestAnimationFrame(main);

export function start() {
  if (gameState === GameState.menu) {
    gameState = GameState.running;
    menu.classList.remove("show");
  }
  if (gameState === GameState.over) {
    gameState = GameState.running;
    gameOverMessage.classList.remove("show");
    snake.reset();
  }
  return;
}

function update() {
  snake.update();
  food.update(snake);
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = "";
  snake.draw(gameBoard);
  food.draw(gameBoard);
}

function checkDeath() {
  if (outsideGrid(snake.getSnakeHead()) || snake.snakeIntersection())
    gameState = GameState.over;
}
