import { UnifiedInput } from './input/Input.js';
import { LakeScene } from './scenes/LakeScene.js';
import { initTelegramViewport, requestFullscreenFromGesture } from './telegram/viewport.js';

const INTERNAL_W = 160;
const INTERNAL_H = 144;

window.CHIBAIT_INPUT = new UnifiedInput();

if (!window.Phaser) throw new Error('Phaser failed to load');

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  width: INTERNAL_W,
  height: INTERNAL_H,
  backgroundColor: '#09151b',
  pixelArt: true,
  roundPixels: true,
  render: { antialias:false, pixelArt:true, roundPixels:true },
  scale: { mode: Phaser.Scale.NONE, width: INTERNAL_W, height: INTERNAL_H },
  scene: [LakeScene]
});

function fitGame() {
  const stage = document.getElementById('stage');
  const canvas = game.canvas;
  if (!stage || !canvas) return;

  const shell = document.getElementById('shell');
  const isMobile = matchMedia('(max-width:760px), (pointer:coarse)').matches;
  const maxW = isMobile ? Math.max(160, window.innerWidth - 24) : Math.max(160, stage.parentElement?.clientWidth || window.innerWidth);
  const maxH = isMobile ? Math.max(144, window.innerHeight - 190) : Math.max(144, window.innerHeight - 40);
  const scale = Math.max(1, Math.min(5, Math.floor(Math.min(maxW / INTERNAL_W, maxH / INTERNAL_H))));

  const cssW = INTERNAL_W * scale;
  const cssH = INTERNAL_H * scale;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  stage.style.width = `${cssW + 4}px`;
  stage.style.height = `${cssH + 4}px`;
}

addEventListener('resize', fitGame);
addEventListener('orientationchange', fitGame);
const cleanupTelegram = initTelegramViewport(fitGame);
addEventListener('pagehide', () => cleanupTelegram?.(), { once:true });

document.addEventListener('pointerdown', requestFullscreenFromGesture, { once:true });
requestAnimationFrame(fitGame);
