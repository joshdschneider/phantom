import { BrowserWindow, screen } from 'electron';

export function monitorWindowHover(window: BrowserWindow) {
  let interval: ReturnType<typeof setInterval> | null = null;
  let isInside = false;

  const startMonitoring = () => {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      if (!window || window.isDestroyed()) {
        clearInterval(interval!);
        return;
      }

      const mousePos = screen.getCursorScreenPoint();
      const bounds = window.getBounds();

      const isMouseInWindow =
        mousePos.x >= bounds.x &&
        mousePos.x <= bounds.x + bounds.width &&
        mousePos.y >= bounds.y &&
        mousePos.y <= bounds.y + bounds.height;

      if (isMouseInWindow !== isInside) {
        isInside = isMouseInWindow;
        window.webContents.send('window-hover', { hover: isInside });
      }
    }, 100);
  };

  const stopMonitoring = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    isInside = false;
    window.webContents.send('window-hover', { hover: false });
  };

  window.on('focus', startMonitoring);
  window.on('blur', stopMonitoring);

  if (window.isFocused()) {
    startMonitoring();
  }

  window.on('close', () => {
    if (interval) {
      clearInterval(interval);
    }
  });
}
