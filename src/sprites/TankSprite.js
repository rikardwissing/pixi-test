import { AnimatedSprite, Sprite, Loader, Container } from 'pixi.js';

export default class TankSprite extends Container {
  constructor() {
    super();
    this.spritesheet = Loader.shared.resources.spaceinvaders.spritesheet;

    this.sprite = new Sprite(this.spritesheet.textures['cannon_frame_01.png']);
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
