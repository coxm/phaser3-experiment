import {AUTO, Game} from 'phaser';

import './css/index.css';

import {PlatformScene} from './scenes/PlatformScene';


const width = 800;
const height = 600;
const game = new Game({
  type: AUTO,
  width,
  height,
  parent: 'root',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200},
    },
  },
  scene: new PlatformScene(width, height),
});


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
