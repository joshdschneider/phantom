import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AppProps } from '../App';

type CaptureSelectProps = AppProps & {};

export const CaptureSelect: React.FC<CaptureSelectProps> = ({ setStep }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('resize-window', { height: 150 });

    setTimeout(() => {
      setVisible(true);
    }, 150);
  }, []);

  const handleStep = () => {
    setStep('question');
  };

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
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div>Capture</div>
            <br />
            <button className="non-draggable" onClick={handleStep}>
              Back
            </button>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};
