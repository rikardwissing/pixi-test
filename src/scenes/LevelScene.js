import { Container, Graphics } from 'pixi.js';
import BaseScene from './BaseScene';
import { appInstance } from '../core/Application';
import MonsterSprite from '../sprites/MonsterSprite';
import BulletSprite from '../sprites/BulletSprite';
import TankSprite from '../sprites/TankSprite';
import config from '../config';
import GameOverScene from './GameOverScene';
import WinScene from './WinScene';

export default class LevelScene extends BaseScene {
  async onCreated() {
    this.sortableChildren = true;
    this.aliens = [];
    this.bullets = [];

    const background = new Graphics();

    background.beginFill(config.colors.secondaryBackground);
    background.drawRect(0, 0, config.game.width, config.game.height);
    background.endFill();
    background.x = -config.game.width / 2;
    background.y = -config.game.height / 2;
    this.addChild(background);

    const header = new Graphics();

    header.beginFill(config.colors.primaryBackground);
    header.drawRect(0, 0, config.game.width, (config.game.height - 300) / 2);
    header.endFill();
    header.x = -config.game.width / 2;
    header.y = -config.game.height / 2;
    header.zIndex = 100;

    this.addChild(header);

    const footer = new Graphics();

    footer.beginFill(config.colors.primaryBackground);
    footer.drawRect(0, 0, config.game.width, (config.game.height - 300) / 2);
    footer.endFill();
    footer.x = -config.game.width / 2;
    footer.y = -config.game.height / 2 + config.game.height - (config.game.height - 300) / 2;
    footer.zIndex = 100;

    this.addChild(footer);

    this.alienContainer = new Container();

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 10; x++) {
        const m = new MonsterSprite();

        this.aliens.push(m);
        m.x = x * 25;
        m.y = y * 20;

        this.alienContainer.addChild(m);
      }
    }

    this.alienContainer.x = (-9 * 25) / 2;
    this.alienContainer.y = -config.game.height / 2 + (config.game.height - 300) / 2 + 30;

    this.addChild(this.alienContainer);

    this.player = new TankSprite();
    this.player.y = config.game.height / 2 - (config.game.height - 300) / 2 - 20;
    this.addChild(this.player);

    this.tickEnemyMovement = 0;
    this.movementPatternIndex = 0;
    this.movementPattern = [[-10, 0], [-10, 0], [0, 10], [10, 0], [10, 0], [10, 0], [10, 0], [0, 10], [-10, 0], [-10, 0]];

    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));

    appInstance.ticker.add(this.ticker.bind(this));
  }

  onFinished() {
    appInstance.ticker.remove(this.ticker.bind(this));
  }

  keyDown(evt) {
    const { code } = evt;

    if (code === 'ArrowLeft') {
      this.goLeft = true;
    }

    if (code === 'ArrowRight') {
      this.goRight = true;
    }
  }

  keyUp(evt) {
    const { code } = evt;

    if (code === 'Space') {
      this.fireBullet();
    }

    if (code === 'ArrowLeft') {
      this.goLeft = false;
    }

    if (code === 'ArrowRight') {
      this.goRight = false;
    }
  }

  fireBullet() {
    const b = new BulletSprite();

    this.bullets.push(b);
    b.anchor.set(0.5);
    b.y = this.player.y - 10;
    b.x = this.player.x;

    this.addChild(b);
  }

  ticker(delta) {
    this.tickEnemyMovement += delta;

    if (this.tickEnemyMovement > 30) {
      this.moveEnemies();
      this.tickEnemyMovement = 0;
    }

    this.moveBullets(delta);
    this.movePlayer(delta);
    this.detectCollisions();

    if (this.aliens.length === 0) {
      this.win();
    }

    if (this.player.parent === null) {
      this.gameOver();
    }
  }

  moveEnemies() {
    const [xDiff, yDiff] = this.movementPattern[this.movementPatternIndex];

    this.alienContainer.x += xDiff;
    this.alienContainer.y += yDiff;

    this.movementPatternIndex++;
    if (this.movementPatternIndex >= this.movementPattern.length) {
      this.movementPatternIndex = 0;
    }
  }

  movePlayer(delta) {
    if (this.goLeft) {
      this.player.x -= delta * 2;
    }

    if (this.goRight) {
      this.player.x += delta * 2;
    }
  }

  moveBullets(delta) {
    this.bullets.forEach((b) => {
      b.y += -5 * delta;
    });
  }

  testForAABB(a, b) {
    const bounds1 = b.getBounds();
    const bounds2 = a.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width
      && bounds1.x + bounds2.width > bounds2.x
      && bounds1.y < bounds2.y + bounds2.height
      && bounds1.y + bounds2.height > bounds2.y
    );
  }

  detectCollisions() {
    this.bullets.forEach((b) => {
      this.aliens.forEach((a) => {
        if (this.testForAABB(a, b)) {
          b.finish();
          a.finish();
        }
      });
    });

    this.aliens.forEach((a) => {
      if (this.testForAABB(a, this.player)) {
        this.player.finish();
      }

      const absY = this.alienContainer.y + a.y;

      if (config.game.height / 2 - (config.game.height - 300) / 2 - absY < 20) {
        this.player.finish();
      }
    });

    this.bullets = this.bullets.filter((b) => !b.finishing);
    this.aliens = this.aliens.filter((a) => !a.finishing);
  }

  win() {
    if (this.isWin) {
      return;
    }

    this.isWin = true;
    this.parent.switchScene(WinScene);
  }

  gameOver() {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;
    this.parent.switchScene(GameOverScene);
  }

  get finish() {
    return new Promise((res) =>
      setTimeout(() => {
        this.onFinished();
        res();
      }, 1000),
    );
  }
}
