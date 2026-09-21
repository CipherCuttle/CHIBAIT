export function telegram() {
  return window.Telegram?.WebApp ?? null;
}

export function readInsets() {
  const tg = telegram();
  const safe = tg?.safeAreaInset ?? {};
  const content = tg?.contentSafeAreaInset ?? {};
  const pick = (key) => Math.max(Number(safe[key] || 0), Number(content[key] || 0));
  return { top:pick('top'), right:pick('right'), bottom:pick('bottom'), left:pick('left') };
}

export function applyInsets() {
  const i = readInsets();
  const root = document.documentElement.style;
  root.setProperty('--safe-top', `${i.top}px`);
  root.setProperty('--safe-right', `${i.right}px`);
  root.setProperty('--safe-bottom', `${i.bottom}px`);
  root.setProperty('--safe-left', `${i.left}px`);
}

export function initTelegramViewport(onChange) {
  const tg = telegram();
  applyInsets();
  if (!tg) return () => {};
  try { tg.ready(); tg.expand(); } catch {}

  const handler = () => { applyInsets(); onChange?.(); };
  const events = ['viewportChanged','safeAreaChanged','contentSafeAreaChanged','fullscreenChanged'];
  for (const event of events) try { tg.onEvent(event, handler); } catch {}
  return () => { for (const event of events) try { tg.offEvent(event, handler); } catch {} };
}

export function requestFullscreenFromGesture() {
  const tg = telegram();
  if (!tg?.requestFullscreen || tg.isFullscreen) return;
  try { tg.requestFullscreen(); } catch {}
}
