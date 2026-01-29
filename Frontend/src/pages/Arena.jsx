import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AshKetchum from '../assets/images/Ash_Ketchum.png';
import Stadium from '../assets/images/stadium1.png';
import { GetPokemonBackGIF, GetPokemonFrontGIF } from '../components/GetPokemonImages';
import PokemonCard from '../components/PokemonCard';
import { PokemonContext } from '../context/PokemonContext';

function Arena() {
  const { username, setOpponentPokemonId, pokemonData, opponentPokemonId, setPlayerPokemonId, playerPokemonId } =
    useContext(PokemonContext);
  const [backGif, setBackGif] = useState(''); // Back GIF for player
  const [frontGif, setFrontGif] = useState(''); // Front GIF for opponent
  const navigate = useNavigate();

  const generateRandomPokemonId = useCallback(
    () => Math.floor(Math.random() * pokemonData.length) + 1,
    [pokemonData.length],
  );

  // Fetch images and Pokémon details when IDs are set
  useEffect(() => {
    const fetchImages = async () => {
      if (playerPokemonId && opponentPokemonId) {
        const backGifUrl = await GetPokemonBackGIF(playerPokemonId);
        const frontGifUrl = await GetPokemonFrontGIF(opponentPokemonId);
        setBackGif(backGifUrl);
        setFrontGif(frontGifUrl);
      }
    };
    fetchImages();
  }, [opponentPokemonId, playerPokemonId]);

  // Generate random Pokémon IDs if not set
  useEffect(() => {
    if (!opponentPokemonId) {
      setOpponentPokemonId(generateRandomPokemonId());
    }
  }, [pokemonData.length, setOpponentPokemonId, generateRandomPokemonId, opponentPokemonId]);

  useEffect(() => {
    if (!playerPokemonId) {
      setPlayerPokemonId(generateRandomPokemonId());
    }
  }, [pokemonData.length, setPlayerPokemonId, generateRandomPokemonId, playerPokemonId]);

  const handleRandomPlayerPokemon = () => {
    setPlayerPokemonId(generateRandomPokemonId());
  };

  const handleRandomOpponentPokemon = () => {
    setOpponentPokemonId(generateRandomPokemonId());
  };

  // Handle Fight button click: Navigate to the battle screen with both Pokémon data
  const startBattle = () => {
    if (playerPokemonId && opponentPokemonId) {
      navigate('/battle', { state: { playerPokemonId, opponentPokemonId } });
    }
  };

  return (
    <>
      <div className="mt-10 flex flex-row justify-between bg-red-400">
        {/* PokeBall */}
        <div className="w-96 scale-100 -rotate-12 transform cursor-pointer transition-transform hover:scale-105">
          <img
            className=""
            onClick={() => document.getElementById('my_modal_5').showModal()}
            src="./src/assets/icons/PokeBall.png"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div
        className="fixed inset-0 grid grid-cols-3 grid-rows-3 items-center gap-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${Stadium})` }}>
        {/* Empty placeholder div */}
        <div className="flex size-40 flex-row justify-start"></div>

        {/* Welcome Player's name box */}
        <div className="absolute top-0 col-span-2 col-start-2 mx-32 w-64 rounded bg-white/30 p-6 px-10 backdrop-blur-md">
          <h1 className="text-center text-3xl font-bold text-black">
            Welcome <br /> {username}
          </h1>
        </div>

        {/* Player's Pokémon Card */}
        <div className="col-span-1 col-start-1 flex flex-col items-center">
          <div className="row flex space-x-4">
            <button onClick={() => navigate('/pokedex/myPokemon')} className="btn btn-primary">
              Choose different Pokémon
            </button>
            <button onClick={handleRandomPlayerPokemon} className="btn btn-secondary">
              Other random Pokémon
            </button>
          </div>
          <div className="">{playerPokemonId && <PokemonCard pokemonId={playerPokemonId} />}</div>
        </div>

        {/* Opponent's Pokémon Card */}
        <div className="col-span-1 col-start-3 flex flex-col items-center">
          <div className="row flex space-x-4">
            <button onClick={() => navigate('/pokedex/opponent')} className="btn btn-primary">
              Choose different opponent
            </button>
            <button onClick={handleRandomOpponentPokemon} className="btn btn-secondary">
              Other random opponent
            </button>
          </div>
          <div className="">{opponentPokemonId && <PokemonCard pokemonId={opponentPokemonId} />}</div>
        </div>

        {/* Pokémon battle ground (middle of arena) */}
        <div className="col-span-1 col-start-2 row-span-1 row-start-2 grid grid-cols-2 grid-rows-2 items-center justify-items-center">
          {/* Player's Pokémon Back GIF */}
          <img
            src={backGif}
            alt="Pokemon back"
            className="col-span-1 col-start-1 row-span-1 row-start-2 mr-24 h-36 w-auto"
          />
          {/* Opponent's Pokémon Front GIF */}
          <img
            src={frontGif}
            alt="Pokemon front"
            className="col-span-1 col-start-2 row-span-1 row-start-1 ml-24 h-24 w-auto"
          />
        </div>

        {/* Fight Button */}
        <button
          onClick={startBattle}
          className="btn btn-primary font-pixel absolute bottom-[12%] left-[50%] -translate-x-[50%] transform border-4 border-black bg-red-500 px-16 py-8 text-4xl whitespace-nowrap text-white shadow-lg">
          <div className="flex h-full w-full items-center justify-center">Fight!</div>
        </button>
      </div>

      {/* Ash Ketchum backview */}
      <img src={AshKetchum} alt="Ash Ketchum" className="absolute bottom-0 left-[20%] h-96 w-96" />
    </>
  );
}

export default Arena;
