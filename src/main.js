import { UnifiedInput } from './input/Input.js';
import { LakeScene } from './scenes/LakeScene.js';
import { initTelegramViewport, requestFullscreenFromGesture, readInsets } from './telegram/viewport.js';

export const INTERNAL_W = 384;
export const INTERNAL_H = 256;

window.CHIBAIT_READY = false;
window.CHIBAIT_INPUT = new UnifiedInput();
if (!window.Phaser) throw Error('Phaser failed to load');

const game = new Phaser.Game({
  type:Phaser.AUTO,
  parent:'game-root',
  width:INTERNAL_W,
  height:INTERNAL_H,
  backgroundColor:'#09212f',
  pixelArt:true,
  roundPixels:true,
  render:{antialias:false,pixelArt:true,roundPixels:true},
  scale:{mode:Phaser.Scale.NONE,width:INTERNAL_W,height:INTERNAL_H},
  scene:[LakeScene]
});

export function fitGame() {
  const stage = document.getElementById('stage');
  const root = document.getElementById('game-root');
  const canvas = game.canvas;
  const controls = document.getElementById('touch-controls');
  if (!stage || !root || !canvas) return;

  const inset = readInsets();
  const mobile = matchMedia('(max-width:760px), (pointer:coarse)').matches;
  const outerW = Math.max(200, window.innerWidth - inset.left - inset.right - (mobile ? 12 : 0));
  const reservedH = mobile ? (controls?.getBoundingClientRect().height || 146) + 30 : 0;
  const outerH = Math.max(160, window.innerHeight - inset.top - inset.bottom - reservedH - (mobile ? 20 : 0));
  const factor = Math.min(outerW / INTERNAL_W, outerH / INTERNAL_H);
  // Prefer exact integer pixels; only downscale fractionally if the phone cannot fit 1x.
  const scale = factor >= 1 ? Math.min(5, Math.floor(factor)) : Math.max(0.4, factor);
  const width = Math.floor(INTERNAL_W * scale);
  const height = Math.floor(INTERNAL_H * scale);
  stage.style.width = root.style.width = canvas.style.width = width + 'px';
  stage.style.height = root.style.height = canvas.style.height = height + 'px';
  window.CHIBAIT_LAYOUT = {width,height,scale};
}

addEventListener('resize', fitGame);
addEventListener('orientationchange', fitGame);
const cleanupTelegram = initTelegramViewport(fitGame);
addEventListener('pagehide', () => cleanupTelegram?.(), {once:true});
document.addEventListener('pointerdown', requestFullscreenFromGesture, {once:true});
requestAnimationFrame(fitGame);
