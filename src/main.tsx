import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement); // Debugging line

createRoot(rootElement!).render(<App />);
