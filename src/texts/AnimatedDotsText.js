import { BitmapText } from 'pixi.js';

export default class AnimatedDotsText extends BitmapText {
  constructor(text, params) {
    super('', params);

    this.dots = 0;
    this.prevDots = 0;

    this.textText = new BitmapText(text, params);
    this.textText.anchor.set(0.5);

    this.dotsText = new BitmapText('', params);
    this.dotsText.x = 0;
    this.dotsText.anchor.set(0, 0.5);

    this.addChild(this.textText);
    this.addChild(this.dotsText);
  }

  tick(delta) {
    this.dots += (delta / 60) * 4;
    if (this.prevDots !== parseInt(this.dots, 10)) {
      if (this.dots >= 4) this.dots = 0;
      this.dotsText.text = '.'.repeat(this.dots);
      this.prevDots = parseInt(this.dots, 10);
    }
  }

  set text(text) {
    this.textText.text = text;
    this.dotsText.x = this.textText.width / 2;
  }
}
