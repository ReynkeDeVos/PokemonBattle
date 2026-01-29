import {
  faFistRaised,
  faHeartbeat,
  faMeteor,
  faShieldAlt,
  faShieldVirus,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { PokemonContext } from '../context/PokemonContext';
import { GetPokemonCry, GetPokemonImage } from './GetPokemonImages';
import { StatBar, TypeBadge } from './ui';

/**
 * Pokemon Card component - displays a Pokemon with its image, type, and stats
 * Fully responsive and reusable across the application
 */
export default function PokemonCard({ pokemonId, onClick, size = 'md', showStats = true, playHoverSound = false }) {
  const { pokemonData } = useContext(PokemonContext);
  const [pokemon, setPokemon] = useState(null);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [pokemonCry, setPokemonCry] = useState(null);
  const audioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const foundPokemon = pokemonData.find((p) => p.id === pokemonId);
    setPokemon(foundPokemon);

    const fetchData = async () => {
      const imageData = await GetPokemonImage(pokemonId);
      setPokemonImage(imageData);

      // Only fetch cry if hover sound is enabled
      if (playHoverSound) {
        const cryData = await GetPokemonCry(pokemonId);
        setPokemonCry(cryData.latest || cryData.legacy);
      }
    };

    fetchData();
  }, [pokemonId, pokemonData, playHoverSound]);

  const handleMouseEnter = () => {
    if (playHoverSound && pokemonCry) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Play sound after 2 second delay
      hoverTimeoutRef.current = setTimeout(() => {
        if (audioRef.current && pokemonCry) {
          audioRef.current.src = pokemonCry;
          audioRef.current.volume = 0.04;
          audioRef.current.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      }, 500);
    }
  };

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before sound plays
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Loading skeleton
  if (!pokemon || !pokemonImage) {
    return (
      <div className="w-full p-2 sm:p-4">
        <div className="mx-auto flex w-full max-w-70 flex-col gap-3 rounded-3xl bg-amber-100/50 p-4 sm:gap-5">
          <div className="skeleton mx-auto aspect-square w-24 rounded-full sm:w-32 md:w-40" />
          <div className="skeleton mx-auto h-4 w-24 sm:w-28" />
          <div className="skeleton mx-auto h-4 w-full" />
          <div className="skeleton mx-auto h-4 w-full" />
        </div>
      </div>
    );
  }

  // Size variants for different contexts
  const sizes = {
    sm: {
      container: 'w-[180px] sm:w-[200px]',
      image: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-xs sm:text-sm',
      padding: 'p-1',
      statSize: 'sm',
    },
    md: {
      container: 'w-[220px] sm:w-[250px]',
      image: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
      title: 'text-sm sm:text-base md:text-lg',
      padding: 'p-2',
      statSize: 'md',
    },
    lg: {
      container: 'w-[240px] sm:w-[280px]',
      image: 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36',
      title: 'text-base sm:text-lg md:text-xl',
      padding: 'p-2 sm:p-3',
      statSize: 'lg',
    },
  };

  const s = sizes[size];

  return (
    <div className={`w-full ${s.padding}`} onClick={onClick}>
      {playHoverSound && <audio ref={audioRef} preload="none" />}
      <div
        className={`card relative mx-auto w-full ${s.container} cursor-pointer rounded-3xl border-2 border-gray-400 bg-linear-to-br from-[#e8d5b7] via-[#e3c6a0] to-[#e3b47b] shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {/* Pokemon Image */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <div className={`${s.image} rounded-full bg-white shadow-inner`}>
            <img
              src={pokemonImage}
              alt={pokemon.name.english}
              className="h-full w-full rounded-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Pokemon Details */}
        <div className="p-2 text-center sm:p-3">
          <h3 className={`font-extrabold text-gray-800 ${s.title}`}>{pokemon.name.english}</h3>

          {/* Type Badges */}
          <div className="mt-1 flex flex-wrap justify-center gap-1 sm:mt-2 sm:gap-2">
            {pokemon.type.map((type) => (
              <TypeBadge key={type} type={type} size={size === 'sm' ? 'sm' : 'md'} />
            ))}
          </div>

          {/* Base Stats */}
          {showStats && (
            <div className="mt-2 grid grid-cols-2 gap-1 sm:mt-3 sm:gap-1.5">
              <StatBar icon={faHeartbeat} label="HP" value={pokemon.base.HP} color="green" size={s.statSize} />
              <StatBar
                icon={faTachometerAlt}
                label="Speed"
                value={pokemon.base.Speed}
                color="yellow"
                size={s.statSize}
              />
              <StatBar icon={faFistRaised} label="Atk" value={pokemon.base.Attack} color="red" size={s.statSize} />
              <StatBar icon={faShieldAlt} label="Def" value={pokemon.base.Defense} color="blue" size={s.statSize} />
              <StatBar
                icon={faMeteor}
                label="S-Atk"
                value={pokemon.base['Sp. Attack']}
                color="orange"
                size={s.statSize}
              />
              <StatBar
                icon={faShieldVirus}
                label="S-Def"
                value={pokemon.base['Sp. Defense']}
                color="purple"
                size={s.statSize}
              />
            </div>
          )}
        </div>

        {/* Decorative border */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-gray-400" />
      </div>
    </div>
  );
}
