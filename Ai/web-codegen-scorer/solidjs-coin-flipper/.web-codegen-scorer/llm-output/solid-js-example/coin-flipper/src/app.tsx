import { createSignal } from "solid-js";

export default function App() {
  const [result, setResult] = createSignal<"Heads" | "Tails" | null>(null);
  const [isFlipping, setIsFlipping] = createSignal(false);

  const flipCoin = () => {
    setResult(null); // Clear previous result
    setIsFlipping(true);

    const flipDuration = 2000; // 2 seconds for the animation

    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
      setResult(outcome);
      setIsFlipping(false);
    }, flipDuration);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4 font-sans">
      <h1 class="text-6xl md:text-7xl font-extrabold text-white mb-12 drop-shadow-lg text-center animate-fade-in-up-once leading-tight">
        The Ultimate Coin Flipper
      </h1>

      <div class="relative w-48 h-48 mb-12">
        <div
          class={`absolute inset-0 rounded-full flex items-center justify-center
            bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-2xl
            border-4 border-yellow-300 transform transition-transform duration-300
            ${isFlipping() ? "animate-coin-spin" : ""} // Apply animation when flipping
          `}
        >
          <span class="text-white text-7xl font-black italic drop-shadow-lg opacity-70">
            {isFlipping() ? "✨" : ""} {/* Show a sparkle during flip */}
          </span>
        </div>
      </div>

      <button
        onClick={flipCoin}
        disabled={isFlipping()}
        class={`
          px-12 py-5 text-2xl md:text-3xl font-bold rounded-full
          bg-gradient-to-r from-emerald-500 to-teal-600 text-white
          shadow-lg hover:shadow-xl transform transition-all duration-300
          ${isFlipping()
            ? "opacity-70 cursor-not-allowed animate-pulse-slow"
            : "hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"}
        `}
      >
        {isFlipping() ? "Flipping..." : "Flip Coin"}
      </button>

      {result() && (
        <div
          class="mt-12 text-7xl md:text-8xl font-extrabold drop-shadow-lg
            bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-500
            animate-fade-in-up-once"
        >
          {result()}
        </div>
      )}
    </div>
  );
}