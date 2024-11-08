import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import sfProFont from '../../assets/fonts/SF-Pro.ttf';
import './App.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MicIcon } from './components/MicIcon';
import { InputIcon } from './components/InputIcon';
import { ScreenshotIcon } from './components/ScreenshotIcon';
import { BoltIcon } from './components/BoltIcon';
import { ArrowRightIcon } from './components/ArrowRightIcon';

function Home() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const getSources = async () => {
    const sources = await window.electron.ipcRenderer.invoke('get-sources');
    console.log(sources);
  };

  const moveMouse = async () => {
    await window.electron.ipcRenderer.invoke('mouse:move', {
      x: 10,
      y: 10,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    await window.electron.ipcRenderer.invoke('mouse:rightClick');
  };

  return (
    <main className="draggable">
      <div className="input-container non-draggable" ref={containerRef}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          rows={1}
          placeholder="What can I help with?"
        />
        <div className="button-group">
          {text.length === 0 ? (
            <button className="icon-button">
              <MicIcon />
            </button>
          ) : (
            <button className="icon-button submit-button" onClick={moveMouse}>
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
      <div className="feature-buttons">
        <button className="non-draggable" onClick={getSources}>
          <ScreenshotIcon />
          <span>Capture</span>
        </button>
        <button className="non-draggable">
          <InputIcon />
          <span>Autocomplete</span>
        </button>
        <button className="non-draggable">
          <BoltIcon />
          <span>Task</span>
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
