import Assets from '../core/AssetManager';
import { Container, Graphics } from 'pixi.js';
import config from '../config';

/**
 * Scene abstract class, defines common scene methods
 * and implements assets preload method.
 *
 * @abstract
 */
export default class BaseScene extends Container {
  /* eslint-disable */
  constructor() {
    super();
    this.createMask();
  }

  /**
   * Hook called on the current active scene, when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {}

  /**
   * Define the assets used by this scene, so they can be loaded
   * and used by all subsequent scenes
   */
  async preload({ images, sounds, sprites, fonts } = {}) {
    await Assets.load({ images, sounds, sprites, fonts }, this.onLoadProgress.bind(this));
    await Assets.prepareImages(images);
  }

  /**
   * Called when an individual asset is loaded and load progress is made
   *
   * @param  {Number} progress Current progress value as a number
   */
  onLoadProgress(progress) {}

  /**
   * Called by the game when this scene's assets have been loaded that the content animations
   * can be started from here
   *
   */
  onCreated() {
    return this.preload();
  }
  /* eslint-enable */

  onFinished() {}

  get finish() {
    this.onFinished();

    return Promise.resolve();
  }

  createMask() {
    const graphics = new Graphics();

    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, config.game.width, config.game.height);
    graphics.x = -config.game.width / 2;
    graphics.y = -config.game.height / 2;
    graphics.endFill();

    this.mask = graphics;

    this.addChild(graphics);
  }
}
