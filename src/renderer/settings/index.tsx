import { createRoot } from 'react-dom/client';
import { Settings } from './Settings';
import './Settings.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Settings />);
