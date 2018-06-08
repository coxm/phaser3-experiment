import {
  AUTO, Game, GameObjects, Math as PhaserMath, Physics, Scene,
} from 'phaser';

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


let score: number = 0;
let scoreText: GameObjects.Text;
let platforms: Physics.Arcade.StaticGroup;
let stars: Physics.Arcade.Group;
let player: Physics.Arcade.Sprite;
let cursors: CursorKeys;
function create(this: Scene): void {
  this.add.image(400, 300, 'sky');

  // Platforms.
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Player.
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
  this.physics.add.collider(player, platforms);

  // Stars.
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: {x: 12, y: 0, stepX: 70},
  });
  stars.children.iterate((child: Physics.Arcade.Sprite): void => {
    child.setBounceY(PhaserMath.FloatBetween(0.4, 0.8));
  }, undefined);
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar as any, undefined, this);

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000',
  });

  function collectStar(
    player: Physics.Arcade.Sprite,
    star: Physics.Arcade.Sprite
  )
    : void
  {
    star.disableBody(true, true);
    score += 1;
    scoreText.setText(`Score: ${score}`);
  }
}


function update(this: Scene): void {
  if (cursors!.left!.isDown) {
    player!.setVelocityX(-160);
    player!.anims.play('left', true);
  }
  else if (cursors!.right!.isDown) {
    player!.setVelocityX(160);
    player!.anims.play('right', true);
  }
  else {
    player!.setVelocityX(0);
    player!.anims.play('turn');
  }

  if (cursors!.up!.isDown && player!.body.touching.down) {
    player!.setVelocityY(-330);
  }
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
