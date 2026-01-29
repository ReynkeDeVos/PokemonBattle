import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PokemonProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PokemonProvider>,
);
