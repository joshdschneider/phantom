import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channel =
  | 'resize-window'
  | 'get-sources'
  | 'show-context-menu'
  | 'mouse:move'
  | 'mouse:left-click'
  | 'mouse:right-click'
  | 'keyboard:type'
  | 'keyboard:press-key';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channel, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channel, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channel, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channel, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
