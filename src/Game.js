import LoadingScene from './scenes/LoadingScene';
import LevelScene from './scenes/LevelScene';
import { Container } from 'pixi.js';

/**
 * Main game stage, manages scenes/levels.
 *
 * @extends {PIXI.Container}
 */
export default class Game extends Container {
  constructor() {
    super();

    this.currentScene = null;
  }

  async start() {
    await this.switchScene(LoadingScene);
    this.switchScene(LevelScene);
  }

  async switchScene(Scene) {
    if (this.currentScene) {
      await this.currentScene.finish;
      this.removeChild(this.currentScene);
    }
    this.currentScene = new Scene();
    this.addChild(this.currentScene);

    return this.currentScene.onCreated();
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    if (this.currentScene === null) return;
    this.currentScene.onResize(width, height);
  }
}
