import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channel =
  | 'resize-window'
  | 'get-sources'
  | 'show-context-menu'
  | 'set-always-on-top'
  | 'start-monitoring-input-events'
  | 'stop-monitoring-input-events'
  | 'mouse:move'
  | 'mouse:up'
  | 'mouse:down'
  | 'mouse:left-click'
  | 'mouse:right-click'
  | 'keyboard:type'
  | 'keyboard:press-key'
  | 'get-theme'
  | 'theme-updated';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channel, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channel, func: (...args: unknown[]) => void) {
      const listener = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    once(channel: Channel, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channel, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
