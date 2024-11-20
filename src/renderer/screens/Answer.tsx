import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AppProps } from '../App';
import { TextStreamer } from '../components/TextStreamer';

type AnswerProps = AppProps & {};

export const Answer: React.FC<AnswerProps> = ({ setStep }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('Thinking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('resize-window', {
      height: 61
    });

    let timeout;
    timeout = setTimeout(() => {
      setVisible(true);
    }, 150);

    setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
            <div className={`answer-container loading-background ${loading ? 'active' : ''}`}>
              {loading ? (
                <div className="answer-loading">
                  <p>
                    <TextStreamer text={'Thinking'} ellipsis />
                  </p>
                </div>
              ) : (
                <div className="answer-text">
                  <p>
                    <TextStreamer
                      text={
                        'The animation now smoothly transitions from no dots to three dots and back to no dots, creating a more complete animation cycle.'
                      }
                      speed={200}
                    />
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};
