import {Game, AUTO} from 'phaser';

import './css/index.css';


const game = new Game({
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload,
    create,
    update,
  }
});


function preload (this: Game): void {
}


function create(this: Game): void {
}


function update(this: Game): void {
}


// Prevent scrolling on spacebar.
document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key === ' ') {
    event.preventDefault();
  }
});


if (__DEV__) {
  Object.assign(window, {
    game,
  });
}
