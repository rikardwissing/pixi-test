import { Howl } from 'howler';
import { Loader, Texture } from 'pixi.js';

const contextImages = require.context('../assets/images', true, /\.(jpg|png)$/im);
const contextSounds = require.context('../assets/sounds', true, /\.(wav)$/im);
const contextSprites = require.context('../assets/sprites', true, /\.(json)$/im);
const contextFonts = require.context('../assets/fonts', true, /\.(png)$/im);

/**
 * Global asset manager to help streamline asset usage in your game.
 * Automatically scans and stores a manifest of all available assets, so that they could
 * be loaded at any time
 *
 */
class AssetManager {
  constructor() {
    this.renderer = null;

    this._assets = {};
    this._sounds = {};
    this._images = {};
    this._sprites = {};
    this._fonts = {};

    this._importAssets();
  }

  /**
   * The main method of the AssetManager, use this to load any desired assets
   *
   * ```js
   * AssetManager.load({
   *  images: {
   *    logo: Assets.images.logo,
   *    logoBack: Assets.images.logoBack,
   *  }
   * })
   * ```
   *
   * @type {Object} options.images id-url object map of the images to be loaded
   * @type {Object} options.sounds id-url object map of the sounds to be loaded
   * @type {Object} options.sounds id-url object map of the sounds to be loaded
   * @type {Function} progressCallback Progress callback function, called every time a single asset is loaded
   *
   * @return {Promise} Returns a promise that is resolved once all assets are loaded
   */
  async load(
    assets = {
      images: this._images,
      sounds: this._sounds,
      sprites: this._sprites,
      fonts: this._fonts,
    },
    progressCallback = () => {},
  ) {
    const { images, sounds, sprites, fonts } = assets;

    let loadProgress = 0;

    const calcTotalProgress = (val, what) => {
      loadProgress += val / Object.values(assets).filter((a) => a).length;
      progressCallback(parseInt(loadProgress, 10), what);
    };

    if (images) await this.loadImagesOrSprites(images, (val) => calcTotalProgress(val, 'graphics'));
    if (sprites) await this.loadImagesOrSprites(sprites, (val) => calcTotalProgress(val, 'sprites'));
    if (fonts) await this.loadImagesOrSprites(fonts, (val) => calcTotalProgress(val, 'fonts'));
    if (sounds) await this.loadSounds(sounds, (val) => calcTotalProgress(val, 'audio'));

    return true;
  }

  /**
   * Create a Loader instance and add the game assets to the queue
   *
   * @return {Promise} Resolved when the assets files are downloaded and parsed into texture objects
   */
  async loadImagesOrSprites(images, progressCallback = () => {}) {
    if (Object.entries(images).length === 0) {
      progressCallback(100);

      return Promise.resolve();
    }

    const loader = Loader.shared;

    for (const [img, url] of Object.entries(images)) {
      if (!loader.resources[img]) {
        loader.add(img, url);
      } else {
        progressCallback(100 / Object.entries(images).length);
      }
    }

    let lastProgress = 0;
    const cID = loader.onProgress.add(() => {
      progressCallback(loader.progress - lastProgress);
      lastProgress = loader.progress;
    });

    return new Promise(loader.load.bind(loader)).then(() => {
      loader.onProgress.detach(cID);
    });
  }

  /**
   * Prerender our loaded textures, so that they don't need to be uploaded to the GPU the first time we use them.
   * Very helpful when we want to swap textures during an animation without the animation stuttering
   *
   * @return {Promise} Resolved when all queued uploads have completed
   */
  prepareImages(images = {}, renderer = this.renderer) {
    const prepare = renderer.plugins.prepare;

    for (const [img] of Object.entries(images)) {
      prepare.add(Texture.from(img));
    }

    return new Promise(prepare.upload.bind(prepare));
  }

  /**
   * Create a Howl instance for each sound asset and load it.
   *
   * @return {Promise} Resolved when the assets files are downloaded and parsed into Howl objects
   */
  async loadSounds(sounds, progressCallback = () => {}) {
    if (Object.entries(sounds).length === 0) {
      progressCallback(100);

      return Promise.resolve();
    }

    const soundPromises = [];

    for (const [id, url] of Object.entries(sounds)) {
      soundPromises.push(this._loadSound(id, url));
    }

    // currently howler doesn't support loading progress
    Promise.all(soundPromises).then(progressCallback(100 / Object.entries(sounds).length));

    return soundPromises;
  }

  get images() {
    return this._images;
  }

  get sounds() {
    return this._sounds;
  }

  get sprites() {
    return this._sprites;
  }

  get fonts() {
    return this._fonts;
  }

  get assets() {
    return this._assets;
  }

  _loadSound(id, url) {
    const sound = new Howl({ src: [url] });

    this._sounds[id] = sound;

    return new Promise((res) => sound.once('load', res));
  }

  _importAssets() {
    contextImages.keys().forEach((filename) => {
      let [, id] = filename.split('.'); // eslint-disable-line prefer-const
      const url = contextImages(filename);

      id = id.substring(1);
      this._assets[id] = url;
      this._images[id] = url;
    });

    contextSounds.keys().forEach((filename) => {
      let [, id] = filename.split('.'); // eslint-disable-line prefer-const
      const url = contextSounds(filename);

      id = id.substring(1);
      this._assets[id] = url;
      this._sounds[id] = url;
    });

    contextSprites.keys().forEach((filename) => {
      let [, id] = filename.split('.'); // eslint-disable-line prefer-const

      id = id.substring(1);

      const url = `${id}.json`;

      this._assets[id] = url;
      this._sprites[id] = url;
    });

    contextFonts.keys().forEach((filename) => {
      let [, id] = filename.split('.'); // eslint-disable-line prefer-const

      id = id.substring(1);

      const url = `${id}.fnt`;

      this._assets[id] = url;
      this._fonts[id] = url;
    });
  }
}

export default new AssetManager();
