import {AUTO, Game, Physics, Scene} from 'phaser';

import './css/index.css';


const game = new Game({
  type: AUTO,
  width: 800,
  height: 600,
  parent: 'root',
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


function preload (this: Scene): void {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}


let platforms: Physics.Arcade.StaticGroup;
let player: Physics.Arcade.Sprite;
function create(this: Scene): void {
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: 'turn',
    frames: [{key: 'dude', frame: 4}],
    frameRate: 20,
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
    frameRate: 10,
    repeat: -1,
  });
}


function update(this: Scene): void {
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
