import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.css';
import { Answer } from './screens/Answer';
import { Autocomplete } from './screens/Autocomplete';
import { CaptureSelect } from './screens/CaptureSelect';
import { ErrorScreen } from './screens/Error';
import { Question } from './screens/Question';
import { TaskSelect } from './screens/TaskSelect';

export interface AppProps {
  step: string;
  setStep: Dispatch<SetStateAction<string>>;
  messages: string[];
  setMessages: Dispatch<SetStateAction<string[]>>;
}

export default function App() {
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-theme').then((theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    });
    window.electron.ipcRenderer.on('theme-updated', (args: any) => {
      document.documentElement.setAttribute('data-theme', args.theme);
    });
  }, []);

  const [step, setStep] = useState('question');
  const [messages, setMessages] = useState<string[]>([]);

  const appProps: AppProps = {
    step,
    setStep,
    messages,
    setMessages
  };

  switch (step) {
    case 'question':
      return <Question {...appProps} />;

    case 'answer':
      return <Answer {...appProps} />;

    case 'autocomplete':
      return <Autocomplete {...appProps} />;

    case 'task':
      return <TaskSelect {...appProps} />;

    case 'capture':
      return <CaptureSelect {...appProps} />;

    default:
      return <ErrorScreen />;
  }
}
