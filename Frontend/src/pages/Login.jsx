import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import PikachuRunning from '../assets/icons/pikachu_running.gif';
import Wallpaper from '../assets/images/wallpaper2.jpg';
import { usePokemonList } from '../components/GetPokemonData';
import { GlassCard } from '../components/ui';
import { PokemonContext } from '../context/PokemonContext';

/**
 * Login page - Entry point for the Pokemon Battle game
 * Shows loading progress while fetching Pokemon data, then presents login form
 */
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setUsername, setPokemonData, username } = useContext(PokemonContext);
  const fetchPokemonList = usePokemonList();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);

  // Fetch Pokemon data on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPokemonList();
      setPokemonData(data);
      setLoadingComplete(true);
    };

    loadData();
  }, [fetchPokemonList, setPokemonData]);

  // Simulate progress bar animation (server can take up to 90s to wake)
  useEffect(() => {
    const estimatedLoadingTime = 80000;
    const progressInterval = 1000;
    const totalSteps = estimatedLoadingTime / progressInterval;

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 100 / totalSteps;
      setProgress(progressValue);

      if (progressValue >= 100 || loadingComplete) {
        clearInterval(interval);
        setProgress(100);
      }
    }, progressInterval);

    return () => clearInterval(interval);
  }, [loadingComplete]);

  // Show "taking longer" message after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loadingComplete) {
        setIsTakingLonger(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loadingComplete]);

  const onSubmit = (data) => {
    setUsername(data.username);
    navigate('/arena');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${Wallpaper})` }}>
      {/* Loading State */}
      {!loadingComplete ? (
        <div className="flex w-full max-w-md flex-col items-center justify-center px-4">
          {/* Progress Bar Container */}
          <div className="relative h-6 w-full overflow-hidden rounded-lg bg-gray-300 shadow-inner sm:h-8">
            {/* Progress Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

            {/* Pikachu Running GIF */}
            <img
              src={PikachuRunning}
              alt="Loading..."
              className="absolute h-8 w-auto sm:h-10"
              style={{ left: `${Math.min(progress, 95)}%`, top: '50%', transform: 'translate(-50%, -60%)' }}
            />
          </div>

          {/* Progress Text */}
          <p className="mt-4 text-center text-base font-bold text-gray-800 sm:text-lg md:text-xl">
            Waking up the server...
            <span className="ml-2 inline-block w-12 text-center">{Math.floor(progress)}%</span>
          </p>

          {/* Extended Loading Message */}
          {isTakingLonger && (
            <p className="mt-4 max-w-sm text-center text-sm font-semibold text-red-600 sm:text-base">
              Sorry, but sometimes the server needs up to 10 minutes to restart. Please wait...
            </p>
          )}
        </div>
      ) : (
        /* Login Form */
        <GlassCard className="animate-slide-up w-full max-w-xs sm:max-w-sm" padding="lg">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
            Welcome
            <br />
            {username || 'Trainer'}!
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                className={`input input-bordered w-full border-gray-300 bg-gray-100 text-lg text-gray-700 placeholder:text-gray-500/70 focus:border-red-500 focus:ring-red-500 sm:text-xl ${errors.username ? 'animate-shake border-red-500' : ''}`}
                {...register('username', { required: true })}
                placeholder={errors.username ? 'Name is required!' : 'Enter your name'}
                autoComplete="username"
              />
              {errors.username && <span className="mt-1 block text-sm text-red-500">This field is required</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full cursor-pointer text-base font-bold sm:text-lg">
              Enter Arena
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
