import { Sprite, Loader } from 'pixi.js';

export default class BulletSprite extends Sprite {
  constructor() {
    const { spritesheet } = Loader.shared.resources.spaceinvaders;

    super(spritesheet.textures['bullet_frame_01.png']);

    setTimeout(this.finish.bind(this), 5000);
  }

  tick() {
    // this.rotation += 0.04 * delta;
  }

  finish() {
    if (this.finishing) {
      return;
    }
    this.finishing = true;

    this.parent.removeChild(this);
  }
}
