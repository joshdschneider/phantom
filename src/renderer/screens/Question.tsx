import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { DEFAULT_WINDOW_HEIGHT } from '../../main/constants';
import { AppProps } from '../App';
import { CaptureIcon } from '../components/CaptureIcon';
import { CloseIcon } from '../components/CloseIcon';
import { FastForwardIcon } from '../components/FastForwardIcon';
import { MicIcon } from '../components/MicIcon';
import { PlusIcon } from '../components/PlusIcon';
import { UpArrowIcon } from '../components/UpArrowIcon';

type QuestionProps = AppProps & {};

export const Question: React.FC<QuestionProps> = ({ setStep, setMessages }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHover, setWindowHover] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('resize-window', { height: DEFAULT_WINDOW_HEIGHT });
    window.electron.ipcRenderer.invoke('start-monitoring-window-hover');

    const removeListener = window.electron.ipcRenderer.on('window-hover', (args: any) => {
      setWindowHover(args.hover);
    });

    setTimeout(() => {
      setVisible(true);
    }, 150);

    return () => {
      removeListener();
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (textarea && container) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      const diff = textarea.scrollHeight - container.clientHeight;
      if (diff !== 0) {
        const newHeight = window.innerHeight + diff;
        const safeMax = Math.min(newHeight, 280);
        if (safeMax !== window.innerHeight) {
          container.style.overflow = 'hidden';
          window.electron.ipcRenderer.invoke('resize-window', {
            height: safeMax
          });
          requestAnimationFrame(() => {
            container.scrollTop = 0;
            container.style.overflow = 'auto';
          });
        } else {
          container.scrollTop = container.scrollHeight + 20;
        }
      }
    }
  }, [text]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setText('');
    setMessages([text]);
    setStep('answer');
  };

  const recordAudio = async () => {
    //
  };

  return (
    <AnimatePresence>
      <main className="base-container draggable">
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="base-container"
          >
            <div className="input-container non-draggable" ref={containerRef}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="What can I help with?"
              />
            </div>
            <div className="controls">
              <div className="controls-section">
                <button className="icon-button non-draggable" onClick={() => setStep('capture')}>
                  <PlusIcon />
                </button>
                <button className="icon-button non-draggable" onClick={() => setStep('autocomplete')}>
                  <CaptureIcon />
                </button>
                <button className="icon-button non-draggable" onClick={() => setStep('task')}>
                  <FastForwardIcon />
                </button>
              </div>
              <div className="controls-section">
                <button className="icon-button non-draggable" style={{ marginRight: '5px' }}>
                  <MicIcon />
                </button>
                <button className="icon-button submit-button non-draggable" disabled={text.length === 0}>
                  <UpArrowIcon />
                </button>
              </div>
            </div>
            <div className="close" aria-hidden={!windowHover}>
              <button
                className="close-button non-draggable"
                onClick={() => {
                  window.electron.ipcRenderer.invoke('close-window');
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};
