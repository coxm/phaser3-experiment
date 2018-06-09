import {Scene, Physics, Math as PhaserMath, GameObjects} from 'phaser';


type Sprite = Physics.Arcade.Sprite;
type Group = Physics.Arcade.Group;
type StaticGroup = Physics.Arcade.StaticGroup;


export class PlatformScene extends Scene {
  private platforms: StaticGroup | null = null;
  private bombs: Group | null = null
  private stars: Group | null = null
  private player: Sprite | null = null
  private cursors: CursorKeys | null = null
  private score: number = 0;
  private scoreText: GameObjects.Text | null = null;

  constructor(private width: number, private height: number) {
    super({});
  }

  preload(): void {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create(): void {
    this.add.image(0.5 * this.width, 0.5 * this.height, 'sky');
    const platforms = this.platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Player.
    const player = this.player = this.physics.add.sprite(100, 450, 'dude');
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
    const stars = this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70},
    });
    stars.children.iterate((child: Sprite): void => {
      child.setBounceY(PhaserMath.FloatBetween(0.4, 0.8));
    }, undefined);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(
      player, stars, this.onHitStar as ArcadePhysicsCallback, undefined, this);

    // Bombs.
    const bombs = this.bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(
      player, bombs, this.onHitBomb as ArcadePhysicsCallback, undefined, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    });
  }

  update(): void {
    const {player, cursors} = this;
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

  private onHitStar(player: Sprite, star: Sprite): void {
    star.disableBody(true, true);
    this.score += 1;
    this.scoreText!.setText(`Score: ${this.score}`);
    if (this.stars!.countActive(true) === 0) {
      this.stars!.children.iterate((child: Sprite): void => {
        child.enableBody(true, child.x, 0, true, true);
      }, null);
      const x = (player.x < 400)
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
      const bomb = this.bombs!.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  private onHitBomb(player: Sprite, bomb: Sprite): void {
    this.physics.pause();
    this.player!.setTint(0xff0000);
    this.player!.anims.play('turn');
  }
}
