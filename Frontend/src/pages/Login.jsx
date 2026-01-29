import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PikachuRunning from '../assets/icons/pikachu_running.gif';
import Wallpaper from '../assets/images/wallpaper2.jpg';
import { usePokemonList } from '../components/GetPokemonData'; // Use only fetchPokemonList
import { PokemonContext } from '../context/PokemonContext';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setUsername, setPokemonData, username } = useContext(PokemonContext);
  const fetchPokemonList = usePokemonList(); // Fetch function only
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0); // To track loading progress
  const [loadingComplete, setLoadingComplete] = useState(false); // For tracking actual completion
  const [isTakingLonger, setIsTakingLonger] = useState(false); // Track if the server is taking longer

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPokemonList(); // Fetch Pokémon data using the hook
      setPokemonData(data); // Set fetched Pokémon data in context
      setLoadingComplete(true); // Mark loading as complete
    };

    loadData();
  }, [fetchPokemonList, setPokemonData]);

  // Simulate progress over 50 seconds
  useEffect(() => {
    const estimatedLoadingTime = 80000; // 90 seconds in milliseconds
    const progressInterval = 1000; // Update progress every second
    const totalSteps = estimatedLoadingTime / progressInterval; // Total steps for progress to reach 100%

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 100 / totalSteps;
      setProgress(progressValue);

      // If progress reaches 100% or loading is done, clear the interval
      if (progressValue >= 100 || loadingComplete) {
        clearInterval(interval);
        setProgress(100); // Ensure progress is 100% when done
      }
    }, progressInterval);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [loadingComplete]);

  // Show the message after progress reaches 100% and loading still isn't complete
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loadingComplete) {
        setIsTakingLonger(true); // Set to true after timeout if still loading
      }
    }, 5000); // After 5 seconds of reaching 100%

    return () => clearTimeout(timeout);
  }, [progress, loadingComplete]);

  const onSubmit = (data) => {
    setUsername(data.username); // Set username in context
    navigate('/arena'); // Navigate to arena once logged in
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${Wallpaper})` }}>
      {!loadingComplete ? (
        <div className="flex flex-col items-center justify-center">
          {/* Progress Bar Container */}
          <div className="relative h-8 w-full max-w-lg overflow-hidden rounded-md bg-gray-300">
            {/* Progress Bar */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{ width: `${progress}%` }} // Width of the progress bar
            />
            {/* Pikachu Running */}
            <img
              src={PikachuRunning}
              alt="Running Pikachu"
              className="absolute h-full"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} // Position Pikachu based on progress
            />
          </div>
          <p className="mt-4 text-xl font-bold text-gray-800">
            Waking up the server...
            <span className="inline-block w-12 text-center">{Math.floor(progress)}%</span>
          </p>
          {isTakingLonger && (
            <p className="mt-4 max-w-md text-center text-lg font-semibold text-red-600">
              Sorry, but sometimes, the server needs like 10min to restart.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-80 rounded bg-white/30 p-10 backdrop-blur-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Welcome <br />
            {username ? username : 'Trainer'}!
          </h2>
          <div className="mb-4">
            <input
              className={`input input-bordered mt-1 w-full border-gray-300 bg-gray-100 text-gray-700 placeholder:text-gray-500/50 ${
                errors.username && 'animate-shake'
              }`}
              {...register('username', { required: true })}
              placeholder={errors.username ? 'Name is required' : 'Enter your name'}
              autoComplete="username"
            />
          </div>
          {errors.username && <span className="text-red-500">This field is required</span>}
          <button type="submit" className="btn btn-primary w-full">
            Enter Arena
          </button>
        </form>
      )}
    </div>
  );
}
