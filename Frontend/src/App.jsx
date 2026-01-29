import './App.css';

import { Route, Routes } from 'react-router-dom';
import Arena from './pages/Arena';
import BattleScreen from './pages/BattleScreen';
import Login from './pages/Login';
import Pokedex from './pages/Pokedex';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/pokedex/:player" element={<Pokedex />} />
        <Route path="/battle" element={<BattleScreen />} />
      </Routes>
    </>
  );
}

export default App;
