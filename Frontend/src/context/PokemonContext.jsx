import { createContext, useMemo, useState } from 'react';

export const PokemonContext = createContext();

// Provider component
export const PokemonProvider = ({ children }) => {
  const [playerPokemonId, setPlayerPokemonId] = useState(null);
  const [opponentPokemonId, setOpponentPokemonId] = useState(null);
  const [username, setUsername] = useState('Trainer');
  const [pokemonData, setPokemonData] = useState([]);

  // Use useMemo to calculate pokemonData length dynamically when it changes
  const pokemonDataLength = useMemo(() => pokemonData.length, [pokemonData]);

  return (
    <PokemonContext.Provider
      value={{
        playerPokemonId,
        setPlayerPokemonId,
        opponentPokemonId,
        setOpponentPokemonId,
        username,
        setUsername,
        pokemonData,
        setPokemonData,
        pokemonDataLength,
      }}>
      {children}
    </PokemonContext.Provider>
  );
};
