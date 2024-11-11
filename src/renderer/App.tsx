import sfProFont from '../../assets/fonts/SF-Pro.ttf';
import './App.css';
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MicIcon } from './components/MicIcon';
import { InputIcon } from './components/InputIcon';
import { BoltIcon } from './components/BoltIcon';
import { ArrowRightIcon } from './components/ArrowRightIcon';
import { DotsIcon } from './components/DotsIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskSelect } from './TaskSelect';
import { Autocomplete } from './Autocomplete';

const Home: React.FC<{
  setStep: Dispatch<SetStateAction<string>>;
}> = ({ setStep }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('resize-window', { height: 100 });

    setTimeout(() => {
      setVisible(true);
    }, 150);

    document.documentElement.style.setProperty(
      '--sf-pro-font',
      `url(${sfProFont})`,
    );
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
            height: safeMax,
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
      e.preventDefault(); // Prevent default to avoid new line
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setText('');
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
              <div className="button-group">
                {text.length === 0 ? (
                  <button className="icon-button" onClick={recordAudio}>
                    <MicIcon />
                  </button>
                ) : (
                  <button
                    className="icon-button submit-button"
                    onClick={handleSubmit}
                  >
                    <ArrowRightIcon />
                  </button>
                )}
              </div>
            </div>
            <div className="controls">
              <div className="feature-buttons">
                <button
                  className="non-draggable"
                  onClick={() => setStep('autocomplete')}
                >
                  <InputIcon />
                  <span>Autocomplete</span>
                </button>
                <button
                  className="non-draggable"
                  onClick={() => setStep('task')}
                >
                  <BoltIcon />
                  <span>Task</span>
                </button>
              </div>
              <div className="context-menu">
                <button
                  className="non-draggable"
                  onClick={() => {
                    window.electron.ipcRenderer.invoke('show-context-menu');
                  }}
                >
                  <DotsIcon />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};

export default function App() {
  const [step, setStep] = useState('home');
  const [messages, setMessages] = useState<string[]>([]);

  const defaultProps = {
    step,
    setStep,
  };

  switch (step) {
    case 'home':
      return <Home {...defaultProps} />;

    case 'autocomplete':
      return <Autocomplete {...defaultProps} />;

    case 'task':
      return <TaskSelect {...defaultProps} />;

    default:
      throw new Error('Invalid step');
  }
}
