export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function getSafeInsets() {
  const tg = getTelegramWebApp();
  const safe = tg?.safeAreaInset ?? {};
  const content = tg?.contentSafeAreaInset ?? {};
  const pick = (k) => Math.max(Number(safe[k] || 0), Number(content[k] || 0));
  return { top: pick('top'), right: pick('right'), bottom: pick('bottom'), left: pick('left') };
}

export function initTelegramViewport(onChange) {
  const tg = getTelegramWebApp();
  if (!tg) return () => {};
  try { tg.ready(); tg.expand(); } catch {}
  const handler = () => onChange?.();
  for (const event of ['viewportChanged','safeAreaChanged','contentSafeAreaChanged','fullscreenChanged']) {
    try { tg.onEvent(event, handler); } catch {}
  }
  return () => {
    for (const event of ['viewportChanged','safeAreaChanged','contentSafeAreaChanged','fullscreenChanged']) {
      try { tg.offEvent(event, handler); } catch {}
    }
  };
}

export function requestTelegramFullscreenOnce() {
  const tg = getTelegramWebApp();
  if (!tg?.requestFullscreen || tg.isFullscreen) return;
  try { tg.requestFullscreen(); } catch {}
}
