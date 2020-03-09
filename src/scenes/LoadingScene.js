import Assets from '../core/AssetManager';
import BaseScene from './BaseScene';
import { BitmapText } from 'pixi.js';
import AnimatedDotsText from '../texts/AnimatedDotsText';
import { appInstance } from '../core/Application';
import config from '../config';

export default class LoadingScene extends BaseScene {
  onCreated() {
    this.loadingText = new BitmapText('0%', { font: { name: 'Small Pixel7', size: 35 }, tint: config.colors.primaryText });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = 0;
    this.loadingText.y = -10;
    this.addChild(this.loadingText);

    this.loadingStatusText = new AnimatedDotsText('Loading', {
      font: { name: 'Small Pixel7', size: 15 },
      tint: config.colors.primaryText,
    });
    this.loadingStatusText.anchor.set(0.5);
    this.loadingStatusText.x = 0;
    this.loadingStatusText.y = 30;
    this.addChild(this.loadingStatusText);

    appInstance.ticker.add(this.ticker.bind(this));

    return super.onCreated();
  }

  onFinished() {
    appInstance.ticker.remove(this.ticker);
  }

  ticker(delta) {
    this.loadingStatusText.tick(delta);
  }

  preload() {
    const sprites = {
      spaceinvaders: Assets.sprites['spaceinvaders-pixijs-atlas'],
    };
    const fonts = { SimpleSmallPixel7: Assets.fonts.SimpleSmallPixel7 };

    return super.preload({ sprites, fonts });
  }

  onResize() {}

  onLoadProgress(val, what) {
    this.loadingText.text = `${val}%`;
    this.loadingStatusText.text = `Loading ${what}`;
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
