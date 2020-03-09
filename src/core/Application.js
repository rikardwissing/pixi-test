import { Application, Graphics } from 'pixi.js';
import config from '../config';
import Game from '../Game';
import { Viewport } from 'pixi-viewport';
import { center } from './utils';
import Assets from './AssetManager';

export let appInstance = null;

/**
 * Game entry point. Holds the game's viewport and responsive background
 * All configurations are described in src/config.js
 */
export default class GameApplication extends Application {
  constructor() {
    super(config.view);

    appInstance = this;

    Assets.renderer = this.renderer;

    this.setupViewport();
    this.initGame();
  }

  /**
   * Game main entry point. Loads and prerenders assets.
   * Creates the main game container.
   *
   */
  async initGame() {
    await this.createBackground();

    this.game = new Game();
    this.viewport.addChild(this.game);

    center(this.viewport, config.view);
    this.onResize();

    this.game.start();
  }

  /**
   * Initialize the game world viewport.
   * Supports handly functions like dragging and panning on the main game stage
   *
   * @return {PIXI.Application}
   */
  setupViewport() {
    const viewport = new Viewport({
      screenWidth: config.view.width,
      screenHeight: config.view.height,
      worldWidth: config.game.width,
      worldHeight: config.game.height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.renderer.plugins.interaction,
    });

    this.renderer.runners.resize.add({
      resize: this.onResize.bind(this),
    });
    document.body.appendChild(this.view);

    this.stage.addChild(viewport);

    if (config.game.drag) viewport.drag();
    if (config.game.pinch) viewport.pinch();
    if (config.game.wheel) viewport.wheel();
    if (config.game.decelerate) viewport.decelerate();

    this.viewport = viewport;
  }

  /**
   * Called after the browser window has been resized.
   * Implement game specific resize logic here
   * @param  {PIXI.Application} app The PIXI Appliaction instance
   * @param  {Number} width         The updated viewport width
   * @param  {Number} height        The updated viewport width
   */
  onResize(width = config.view.width, height = config.view.height) {
    center(this.background, { width, height });
    this.game.onResize(width, height);

    if (config.view.centerOnResize) {
      this.viewport.x = width / 2;
      this.viewport.y = height / 2;
    }
  }

  /**
   * Initializes the static background that is used to
   * fill the empty space around our game stage. This is used to compensate for the different browser window sizes.
   *
   */
  async createBackground() {
    const fonts = { SimpleSmallPixel7: Assets.fonts.SimpleSmallPixel7 };

    await Assets.load({ fonts });

    const graphics = new Graphics();

    graphics.beginFill(config.colors.primaryBackground);
    graphics.drawRect(0, 0, config.game.width, config.game.height);
    graphics.endFill();

    this.stage.addChildAt(graphics);
    this.background = graphics;
  }
}
