import { useContext, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router-dom';

import Arrow from '../assets/icons/arrow.png';
import AshKetchum from '../assets/images/Ash_Ketchum.png';
import Stadium from '../assets/images/stadium1.png';
import Winner from '../assets/images/Winner.png';
import { GetPokemonBackGIF, GetPokemonCry, GetPokemonFrontGIF } from '../components/GetPokemonImages';
import PokemonCard from '../components/PokemonCard';
import { HPBar, PixelButton } from '../components/ui';
import { PokemonContext } from '../context/PokemonContext';

/**
 * Battle Screen - Where the Pokemon battle takes place
 * Features turn-based combat with HP tracking, animations, and fight log
 */
export default function BattleScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerPokemonId, opponentPokemonId } = location.state || {};
  const { pokemonData, setPlayerPokemonId, setOpponentPokemonId } = useContext(PokemonContext);

  // Pokemon data state
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [playerPokemonBackGif, setPlayerPokemonBackGif] = useState('');
  const [playerPokemonFrontGif, setPlayerPokemonFrontGif] = useState('');
  const [opponentPokemonFrontGif, setOpponentPokemonFrontGif] = useState('');
  const [playerCry, setPlayerCry] = useState(null);
  const [opponentCry, setOpponentCry] = useState(null);

  // Battle state
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [playerMaxHP, setPlayerMaxHP] = useState(100);
  const [opponentMaxHP, setOpponentMaxHP] = useState(100);
  const [round, setRound] = useState(0);
  const [winner, setWinner] = useState(null);
  const [fightLog, setFightLog] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('player');

  // Window size for confetti
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const logRef = useRef(null);
  const playerAudioRef = useRef(null);
  const opponentAudioRef = useRef(null);

  // Play Pokemon cry sound
  const playCry = (audioRef, cryUrl) => {
    if (audioRef.current && cryUrl) {
      audioRef.current.src = cryUrl;
      audioRef.current.volume = 0.015;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  // Track window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll fight log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [fightLog]);

  const addToFightLog = (message) => {
    setFightLog((prev) => [...prev, message]);
  };

  const calculateDamage = (attacker, defender) => {
    const useSpecialAttack = Math.random() < 0.25;
    const useSpecialDefense = Math.random() < 0.25;

    let attack = attacker.base.Attack;
    let defense = defender.base.Defense;
    let attackType = 'Base Attack';
    let defenseType = 'Base Defense';

    if (useSpecialAttack) {
      attack = attacker.base['Sp. Attack'];
      attackType = 'Special Attack';
    }
    if (useSpecialDefense) {
      defense = defender.base['Sp. Defense'];
      defenseType = 'Special Defense';
    }

    addToFightLog(`${attacker.name.english} uses ${attackType} (<b>${attack}</b>)`);
    addToFightLog(`${defender.name.english} uses ${defenseType} (<b>${defense}</b>)`);

    const damage = Math.max((attack - (defense / 3) * 2) / 2, 10);
    return damage;
  };

  const handleFight = () => {
    if (playerHP <= 0 || opponentHP <= 0 || isAttacking) return;

    setIsAttacking(true);

    // Play attacker's cry when attacking
    if (currentTurn === 'player') {
      playCry(playerAudioRef, playerCry);
    } else {
      playCry(opponentAudioRef, opponentCry);
    }

    setTimeout(() => {
      setRound((prev) => prev + 1);

      if (currentTurn === 'player') {
        const damage = calculateDamage(playerPokemon, opponentPokemon);
        setOpponentHP((prev) => Math.max(Math.round(prev - damage), 0));
        addToFightLog(`${playerPokemon.name.english} deals <b>${Math.round(damage)}</b> damage!`);
        addToFightLog('───────────');
        setCurrentTurn('opponent');
      } else {
        const damage = calculateDamage(opponentPokemon, playerPokemon);
        setPlayerHP((prev) => Math.max(Math.round(prev - damage), 0));
        addToFightLog(`${opponentPokemon.name.english} deals <b>${Math.round(damage)}</b> damage!`);
        addToFightLog('───────────');
        setCurrentTurn('player');
      }

      setIsAttacking(false);
    }, 800);
  };

  // Initialize Pokemon data
  useEffect(() => {
    const fetchPokemonData = async () => {
      if (!playerPokemonId || !opponentPokemonId) return;

      const playerData = pokemonData.find((p) => p.id === playerPokemonId);
      const opponentData = pokemonData.find((p) => p.id === opponentPokemonId);

      if (playerData) {
        setPlayerPokemon(playerData);
        setPlayerHP(playerData.base.HP);
        setPlayerMaxHP(playerData.base.HP);
      }
      if (opponentData) {
        setOpponentPokemon(opponentData);
        setOpponentHP(opponentData.base.HP);
        setOpponentMaxHP(opponentData.base.HP);
      }

      const [playerBack, playerFront, opponentFront, playerCryData, opponentCryData] = await Promise.all([
        GetPokemonBackGIF(playerPokemonId),
        GetPokemonFrontGIF(playerPokemonId),
        GetPokemonFrontGIF(opponentPokemonId),
        GetPokemonCry(playerPokemonId),
        GetPokemonCry(opponentPokemonId),
      ]);

      setPlayerPokemonBackGif(playerBack);
      setPlayerPokemonFrontGif(playerFront);
      setOpponentPokemonFrontGif(opponentFront);
      setPlayerCry(playerCryData.latest || playerCryData.legacy);
      setOpponentCry(opponentCryData.latest || opponentCryData.legacy);

      // Determine who goes first based on speed
      if (playerData && opponentData) {
        if (playerData.base.Speed >= opponentData.base.Speed) {
          addToFightLog(`${playerData.name.english} is faster and attacks first!`);
          setCurrentTurn('player');
        } else {
          addToFightLog(`${opponentData.name.english} is faster and attacks first!`);
          setCurrentTurn('opponent');
          setRound(1);
        }
      }
    };

    fetchPokemonData();
  }, [playerPokemonId, opponentPokemonId, pokemonData]);

  // Check for winner
  useEffect(() => {
    if (playerHP <= 0 && playerPokemon) {
      setWinner(opponentPokemon.name.english);
      addToFightLog(`<b>${opponentPokemon.name.english}</b> wins the battle!`);
    } else if (opponentHP <= 0 && opponentPokemon) {
      setWinner(playerPokemon.name.english);
      addToFightLog(`<b>${playerPokemon.name.english}</b> wins the battle!`);
    }
  }, [playerHP, opponentHP, playerPokemon, opponentPokemon]);

  const returnToArena = () => {
    const randomId = Math.floor(Math.random() * pokemonData.length) + 1;
    if (winner === playerPokemon?.name.english) {
      setOpponentPokemonId(randomId);
    } else {
      setPlayerPokemonId(randomId);
    }
    navigate('/arena');
  };

  // Loading state
  if (!playerPokemon || !opponentPokemon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="loading loading-spinner loading-lg" />
          <p className="mt-4">Loading battle...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Stadium})` }}>
      {/* Hidden audio elements for Pokemon cries */}
      <audio ref={playerAudioRef} preload="none" />
      <audio ref={opponentAudioRef} preload="none" />

      <div className="safe-area-inset flex h-full flex-col px-2 py-2 sm:px-4 sm:py-4">
        {/* Main Battle Area */}
        <main className="flex flex-1 flex-col">
          {/* Battle Grid - Cards on sides, battlefield in center */}
          <div className="grid flex-1 grid-cols-1 gap-2 lg:grid-cols-[0.6fr_2fr_0.6fr] lg:px-16 xl:px-28 2xl:px-40">
            {/* Player's Card - Left side (hidden on mobile) */}
            <div className="hidden items-center justify-center lg:flex">
              <PokemonCard pokemonId={playerPokemon.id} size="md" showStats={false} />
            </div>

            {/* Battlefield - Center */}
            <div className="relative flex flex-1 items-center justify-center">
              {/* Fixed aspect-ratio container for consistent GIF positioning */}
              <div className="relative w-full max-w-md overflow-visible" style={{ aspectRatio: '16 / 10' }}>
                {/* Opponent's Pokemon - indicator, HP, GIF */}
                <div className="absolute flex flex-col items-center" style={{ top: '-28%', right: '-10%' }}>
                  {/* Turn indicator - bigger */}
                  <div
                    className={`flex h-20 items-center justify-center sm:h-24 md:h-28 lg:h-32 ${currentTurn === 'opponent' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <img
                      src={Arrow}
                      alt="Opponent's turn"
                      className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
                    />
                  </div>
                  {/* HP Bar */}
                  <HPBar currentHP={opponentHP} maxHP={opponentMaxHP} size="md" />
                  {/* Pokemon GIF */}
                  <div
                    className={`mt-1 transition-transform duration-300 ${
                      isAttacking && currentTurn === 'opponent' ? '-translate-x-2 sm:-translate-x-4' : ''
                    }`}>
                    {opponentPokemonFrontGif && (
                      <img
                        src={opponentPokemonFrontGif}
                        alt={opponentPokemon.name.english}
                        className="h-16 w-auto object-contain sm:h-20 md:h-24 lg:h-28"
                      />
                    )}
                  </div>
                </div>

                {/* Player's Pokemon - indicator, HP, GIF */}
                <div className="absolute flex flex-col items-center" style={{ top: '0%', left: '-10%' }}>
                  {/* Turn indicator - bigger */}
                  <div
                    className={`flex h-20 items-center justify-center sm:h-24 md:h-28 lg:h-32 ${currentTurn === 'player' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <img
                      src={Arrow}
                      alt="Your turn"
                      className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
                    />
                  </div>
                  {/* HP Bar */}
                  <HPBar currentHP={playerHP} maxHP={playerMaxHP} size="md" />
                  {/* Pokemon GIF */}
                  <div
                    className={`mt-1 transition-transform duration-300 ${
                      isAttacking && currentTurn === 'player' ? 'translate-x-2 sm:translate-x-4' : ''
                    }`}>
                    {playerPokemonBackGif && (
                      <img
                        src={playerPokemonBackGif}
                        alt={playerPokemon.name.english}
                        className="h-24 w-auto object-contain sm:h-28 md:h-32 lg:h-36"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent's Card - Right side (hidden on mobile) */}
            <div className="hidden items-center justify-center lg:flex">
              <PokemonCard pokemonId={opponentPokemon.id} size="md" showStats={false} />
            </div>
          </div>

          {/* Mobile Pokemon Cards - shown only on smaller screens */}
          <div className="mt-2 flex justify-center gap-2 lg:hidden">
            <div className="max-w-45 flex-1">
              <PokemonCard pokemonId={playerPokemon.id} size="sm" showStats={false} />
            </div>
            <div className="max-w-45 flex-1">
              <PokemonCard pokemonId={opponentPokemon.id} size="sm" showStats={false} />
            </div>
          </div>

          {/* Attack Button - centered at bottom */}
          <div className="flex justify-center py-4">
            <PixelButton onClick={handleFight} variant="primary" size="lg" disabled={isAttacking || winner !== null}>
              Attack!
            </PixelButton>
          </div>
        </main>

        {/* Fight Log - Fixed bottom-left corner */}
        <div
          ref={logRef}
          className="fixed bottom-4 left-4 z-40 h-36 w-56 overflow-y-auto rounded-lg bg-white/90 p-2 text-gray-900 shadow-lg sm:h-44 sm:w-64 sm:p-3 md:h-52 md:w-72">
          <h3 className="mb-1 text-xs font-bold sm:text-sm">Battle Log</h3>
          {fightLog.map((log, index) => (
            <p key={index} className="text-[10px] sm:text-xs" dangerouslySetInnerHTML={{ __html: log }} />
          ))}
        </div>

        {/* Ash Ketchum - Same position as Arena */}
        <div className="pointer-events-none fixed bottom-0 left-[15%] hidden lg:block">
          <img src={AshKetchum} alt="Ash Ketchum" className="h-80 w-auto object-contain xl:h-96" />
        </div>

        {/* Winner Modal - Retro SNES Victory Screen */}
        {winner && (
          <>
            {/* Confetti behind the modal */}
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={true}
              numberOfPieces={300}
              colors={['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB', '#32CD32']}
            />

            {/* Dark backdrop with blur */}
            <div className="fixed inset-0 z-50 flex animate-backdrop-fade items-center justify-center bg-black/70 p-4 backdrop-blur-md">

              <div className="relative w-full max-w-sm animate-slide-down-slow sm:max-w-md">

                {/* Main retro card - sharp edges, hard shadow, pixel border */}
                <div
                  className="relative overflow-hidden border-4 border-white bg-[#0f0f2d] p-6 sm:p-8"
                  style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1), -2px -2px 0px 0px rgba(80,80,120,0.5)' }}
                >
                  {/* CRT Scanline overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)',
                    }}
                  />

                  {/* Inner pixel border accent */}
                  <div className="pointer-events-none absolute inset-2 border-2 border-yellow-400/60" />

                  {/* VICTORY! header - pixel font, solid yellow, no gradient */}
                  <div className="relative z-20 mb-2 text-center">
                    <div className="inline-block overflow-hidden animate-retro-reveal">
                      <h1 className="font-pixel text-xl text-yellow-400 sm:text-2xl md:text-3xl"
                        style={{ textShadow: '2px 2px 0px #b8860b, 4px 4px 0px rgba(0,0,0,0.8)' }}
                      >
                        VICTORY!
                      </h1>
                    </div>
                  </div>

                  {/* Decorative pixel divider */}
                  <div className="relative z-20 mx-auto mb-4 flex items-center justify-center gap-1">
                    <div className="h-1 w-4 bg-yellow-400" />
                    <div className="h-1 w-2 bg-white" />
                    <div className="h-1 w-8 bg-yellow-400" />
                    <div className="h-1 w-2 bg-white" />
                    <div className="h-1 w-4 bg-yellow-400" />
                  </div>

                  {/* Trophy image - pixelated rendering */}
                  <div className="relative z-20 mx-auto mb-3 w-fit">
                    <img
                      src={Winner}
                      alt="Winner!"
                      className="relative mx-auto h-auto w-24 sm:w-28"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>

                  {/* Winner name - pixel font, solid white */}
                  <h2
                    className="relative z-20 mb-1 text-center font-pixel text-lg text-white sm:text-xl md:text-2xl"
                    style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}
                  >
                    {winner}
                  </h2>
                  <p
                    className="relative z-20 mb-4 text-center font-pixel text-xs text-yellow-400 sm:text-sm"
                    style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8)' }}
                  >
                    WINS THE BATTLE!
                  </p>

                  {/* Pokemon sprite showcase - pixelated, bouncing */}
                  <div className="relative z-20 my-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={winner === playerPokemon.name.english ? playerPokemonFrontGif : opponentPokemonFrontGif}
                        alt={winner}
                        className="h-32 w-auto animate-retro-bounce sm:h-40"
                        style={{ imageRendering: 'pixelated', transform: 'scale(1.2)' }}
                      />
                    </div>
                  </div>

                  {/* Pixel divider before button */}
                  <div className="relative z-20 mx-auto mb-4 flex items-center justify-center gap-1">
                    <div className="h-1 w-4 bg-yellow-400" />
                    <div className="h-1 w-2 bg-white" />
                    <div className="h-1 w-8 bg-yellow-400" />
                    <div className="h-1 w-2 bg-white" />
                    <div className="h-1 w-4 bg-yellow-400" />
                  </div>

                  {/* Retro button using PixelButton component */}
                  <div className="relative z-20">
                    <PixelButton
                      onClick={returnToArena}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <span className="animate-text-blink">{'>'}</span>
                      &nbsp;BACK TO ARENA&nbsp;
                      <span className="animate-text-blink">{'<'}</span>
                    </PixelButton>
                  </div>
                </div>

                {/* Pixel sparkle decorations at corners */}
                <div className="absolute -top-2 -left-2 h-2 w-2 animate-pixel-sparkle bg-yellow-400" />
                <div
                  className="absolute -top-2 -right-2 h-2 w-2 animate-pixel-sparkle bg-white"
                  style={{ animationDelay: '0.3s' }}
                />
                <div
                  className="absolute -bottom-2 -left-2 h-2 w-2 animate-pixel-sparkle bg-white"
                  style={{ animationDelay: '0.6s' }}
                />
                <div
                  className="absolute -bottom-2 -right-2 h-2 w-2 animate-pixel-sparkle bg-yellow-400"
                  style={{ animationDelay: '0.9s' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
