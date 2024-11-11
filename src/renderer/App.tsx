import { useState } from 'react';
import './App.css';
import { Autocomplete } from './screens/Autocomplete';
import { Chat } from './screens/Chat';
import { TaskSelect } from './screens/TaskSelect';

export interface AppProps {
  step: string;
  setStep: (step: string) => void;
}

export default function App() {
  const [step, setStep] = useState('home');
  const [messages, setMessages] = useState<string[]>([]);

  const appProps: AppProps = {
    step,
    setStep
  };

  switch (step) {
    case 'home':
      return <Chat {...appProps} />;

    case 'autocomplete':
      return <Autocomplete {...appProps} />;

    case 'task':
      return <TaskSelect {...appProps} />;

    default:
      throw new Error('Invalid step');
  }
}
