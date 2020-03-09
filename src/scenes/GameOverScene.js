import BaseScene from './BaseScene';
import { BitmapText } from 'pixi.js';
import config from '../config';

export default class GameOverScene extends BaseScene {
  onCreated() {
    this.text = new BitmapText('Game Over :(', {
      font: { name: 'Small Pixel7', size: 35 },
      tint: config.colors.primaryText,
    });
    this.text.anchor.set(0.5);
    this.text.x = 0;
    this.text.y = -10;
    this.addChild(this.text);

    return super.onCreated();
  }

  get finish() {
    return new Promise((res) =>
      setTimeout(() => {
        this.onFinished();
        res();
      }, 0),
    );
  }
}
