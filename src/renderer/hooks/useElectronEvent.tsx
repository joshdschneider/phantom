import { useEffect } from 'react';
import { Channel } from '../../main/preload';

export function useElectronEvent<T>(
  channel: Channel,
  callback: (data: T) => void,
) {
  useEffect(() => {
    const subscriptionCallback = (...args: unknown[]) => {
      const data = args[0] as T;
      callback(data);
    };

    const unsubscribe = window.electron.ipcRenderer.on(
      channel,
      subscriptionCallback,
    );

    return () => {
      unsubscribe();
    };
  }, [channel, callback]);
}
