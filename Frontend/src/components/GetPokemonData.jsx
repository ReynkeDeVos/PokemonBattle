import axios from 'axios';
import { useEffect } from 'react';

// Hook to fetch Pokémon data from the server
export function usePokemonList() {
  // Define the function to fetch the Pokémon data
  const fetchPokemonList = async () => {
    try {
      // const response = await axios.get('http://localhost:3000/pokemon');
      const response = await axios.get('https://pokemonbattle-5ur0.onrender.com/pokemon');
      return response.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      throw error; // Rethrow error for the calling component to handle
    }
  };

  // Fetch the data when the component mounts (optional if you want to prefetch)
  useEffect(() => {
    fetchPokemonList();
  }, []);

  // Return only the fetch function so it can be called when needed
  return fetchPokemonList;
}
