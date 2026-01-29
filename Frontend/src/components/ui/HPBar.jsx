import HeartIcon from '../../assets/icons/heart.svg';

/**
 * Health Points bar component - Gameboy/SNES retro style
 */
export default function HPBar({ currentHP, maxHP, showLabel = true, size = 'md' }) {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));

  // Retro color scheme based on HP percentage
  const getBarColor = () => {
    if (percentage > 50) return 'bg-[#88c070]'; // Gameboy green
    if (percentage > 25) return 'bg-[#f8d858]'; // Gameboy yellow
    return 'bg-[#e85048]'; // Gameboy red
  };

  const sizes = {
    sm: {
      container: 'gap-1',
      icon: 'h-5 w-5 sm:h-6 sm:w-6',
      text: 'text-xs sm:text-sm',
      bar: 'h-3 sm:h-4',
      barWidth: 'min-w-16 sm:min-w-20',
    },
    md: {
      container: 'gap-1.5',
      icon: 'h-6 w-6 sm:h-7 sm:w-7',
      text: 'text-sm sm:text-base',
      bar: 'h-3 sm:h-4',
      barWidth: 'min-w-20 sm:min-w-24',
    },
    lg: {
      container: 'gap-2',
      icon: 'h-8 w-8 sm:h-10 sm:w-10',
      text: 'text-base sm:text-lg md:text-xl',
      bar: 'h-5 sm:h-6',
      barWidth: 'min-w-24 sm:min-w-32',
    },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.container}`}>
      {showLabel && (
        <div className={`flex items-center ${s.container}`}>
          <img src={HeartIcon} alt="HP" className={s.icon} />
          <span
            className={`font-pixel font-bold text-white ${s.text}`}
            style={{
              textShadow:
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
            }}>
            {currentHP}
          </span>
        </div>
      )}
      {/* Retro Gameboy-style HP bar */}
      <div
        className={`${s.barWidth} border-2 border-black bg-[#303030] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]`}
        style={{ imageRendering: 'pixelated' }}>
        <div className={`${s.bar} w-full bg-[#181818]`}>
          <div
            className={`${s.bar} transition-all duration-300 ease-out ${getBarColor()}`}
            style={{
              width: `${percentage}%`,
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
