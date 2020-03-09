import { AnimatedSprite, Loader, Container } from 'pixi.js';

export default class MonsterSprite extends Container {
  constructor() {
    super();
    this.spritesheet = Loader.shared.resources.spaceinvaders.spritesheet;

    this.sprite = new AnimatedSprite(this.spritesheet.animations.enemy_01);
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();
    this.sprite.anchor.set(0.5);

    this.explosionSprite = new AnimatedSprite(this.spritesheet.animations.explosion);
    this.explosionSprite.animationSpeed = 0.1;
    this.explosionSprite.anchor.set(0.5);

    this.finishing = false;

    this.addChild(this.sprite);
  }

  tick() {
    // this.rotation += 0.04 * delta;
    // console.log("tick");
  }

  finish() {
    if (this.finishing) {
      return;
    }

    this.finishing = true;
    this.explosionSprite.play();

    this.removeChild(this.sprite);
    this.addChild(this.explosionSprite);

    setTimeout(() => {
      this.parent.removeChild(this);
    }, (2 * 15) / 0.1);
  }
}
