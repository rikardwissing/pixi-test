export default {
  view: {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    worldWidth: 336,
    worldHeight: 478,
    resizeTo: window,
    centerOnResize: true,
  },
  game: {
    width: 336,
    height: 478,
    drag: false,
    pinch: false,
    decelerate: false,
    wheel: false,
  },
  assets: {
    root: '/',
  },
  colors: {
    primaryBackground: 0x1e4c61,
    secondaryBackground: 0x307090,
    primaryText: 0xb4d4e8,
  },
};
