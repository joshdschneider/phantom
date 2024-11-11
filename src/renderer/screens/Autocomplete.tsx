import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { AppProps } from '../App';
import { StopIcon } from '../components/StopIcon';
import { TextStreamer } from '../components/TextStreamer';
import { useElectronEvent } from '../hooks/useElectronEvent';

type AutocompleteProps = AppProps & {};

export const Autocomplete: React.FC<AutocompleteProps> = ({ setStep }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('Select an editable area on your screen');

  useEffect(() => {
    window.electron.ipcRenderer.invoke('resize-window', {
      height: 61
    });
    window.electron.ipcRenderer.invoke('set-always-on-top', {
      alwaysOnTop: true
    });
    window.electron.ipcRenderer.invoke('start-monitoring-input-events');

    let timeout;
    timeout = setTimeout(() => {
      setVisible(true);
    }, 150);

    return () => {
      clearTimeout(timeout);
      window.electron.ipcRenderer.invoke('set-always-on-top', {
        alwaysOnTop: false
      });
      window.electron.ipcRenderer.invoke('stop-monitoring-input-events');
    };
  }, []);

  const handleMouseMove = useCallback(
    (data: {
      type: 'mouseUp';
      targetPoint: {
        x: number;
        y: number;
      };
    }) => {
      console.log(`Mouse moved to: x=${data.targetPoint.x}, y=${data.targetPoint.y}`);
    },
    []
  );

  useElectronEvent<{
    type: 'mouseUp';
    targetPoint: {
      x: number;
      y: number;
    };
  }>('mouse:up', handleMouseMove);

  return (
    <AnimatePresence>
      <main className="base-container draggable">
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="base-container"
          >
            <div className="autocomplete-container">
              <div className="autocomplete">
                <p>
                  <TextStreamer text={text} />
                </p>
                <button className="cancel-button non-draggable" onClick={() => setStep('home')}>
                  <StopIcon />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};
