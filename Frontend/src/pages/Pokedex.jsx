import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import { PokemonContext } from '../context/PokemonContext';

function Pokedex() {
  const { pokemonData, setPlayerPokemonId, setOpponentPokemonId } = useContext(PokemonContext);
  const navigate = useNavigate();
  const { player } = useParams();

  const handleCardClick = (id) => {
    if (player === 'myPokemon') {
      setPlayerPokemonId(id);
    } else if (player === 'opponent') {
      setOpponentPokemonId(id);
    }
    navigate('/arena');
  };

  // TODO:  // Fetch pokemonData here if it's not already fetched via fetchPokemonList() from Frontend/src/components/GetPokemonData.jsx
  // useEffect(() => {
  // }, []);

  return (
    <>
      <div className="">
        {/* Pokemon Output */}
        <div className="flex flex-wrap">
          {pokemonData.map((pokemon) => (
            // size values to change card size: size-1/5 size-3/12 size-min
            <div key={pokemon.id} className="size-1/5 cursor-pointer">
              <PokemonCard className="" pokemonId={pokemon.id} onClick={() => handleCardClick(pokemon.id)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Pokedex;
