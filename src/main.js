import { LakeScene } from './scenes/LakeScene.js';

if (!window.Phaser) throw new Error('Phaser failed to load');

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#061018',
  pixelArt: true,
  roundPixels: true,
  render: { antialias: false, pixelArt: true, roundPixels: true },
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  scene: [LakeScene]
});
