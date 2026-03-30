"use client";
import { useState, useEffect } from 'react';
import { connectWallet, buyAccess, getTimeLeft } from '@/lib/stellar';

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [duration, setDuration] = useState<number>(3600);
  const [customInput, setCustomInput] = useState<string>("60");
  const [loading, setLoading] = useState(false);

  // Sync & Timer Logic
  const sync = async (userAddr: string) => {
    const seconds = await getTimeLeft(userAddr);
    setTimeLeft(seconds);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (address) {
      sync(address);
      const i = setInterval(() => sync(address), 30000);
      return () => clearInterval(i);
    }
  }, [address]);

  const handleInputChange = (val: string) => {
    setCustomInput(val);
    const mins = parseInt(val);
    if (!isNaN(mins)) setDuration(mins * 60);
  };

  const totalHours = (parseInt(customInput || "0") / 60).toFixed(2);
  const leaseProgress = duration > 0
    ? Math.max(0, Math.min(100, (timeLeft / duration) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] flex items-center justify-center p-3 sm:p-5 font-sans">
      {/* Background Soft Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/60 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-lime-100/60 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-3xl">
        {/* Logo Section */}
        <header className="mb-4 sm:mb-5 text-center relative">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CompuTeRent</h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">High Performance Infrastructure</p>
          <button
            onClick={() => window.location.reload()}
            className="absolute right-0 top-0 p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
            title="Refresh page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {address && (
            <div className="mt-2 inline-flex bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white shadow-sm text-[11px] font-semibold text-gray-500">
              ID: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </header>

        {!address ? (
          <div className="bg-white/60 backdrop-blur-3xl border border-white p-10 sm:p-14 rounded-2xl sm:rounded-3xl shadow-2xl text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-200/60">
            <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 tracking-tight text-gray-900">Access Global <br/>Compute Nodes.</h2>
            <button 
              onClick={async () => setAddress(await connectWallet())}
              className="px-8 sm:px-10 py-3 bg-emerald-600 text-white text-sm sm:text-base font-bold rounded-full hover:bg-emerald-500 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          /* BENTO GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[110px] sm:auto-rows-[124px] md:auto-rows-[132px]">
            
            {/* LARGE TILE: TIMER STATUS */}
            <div className="row-span-3 sm:row-span-2 md:col-span-2 md:row-span-2 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-200/60">
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3 h-full">
                <div className="flex flex-col min-h-0">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-1.5 block">System Pulse</span>
                <h2 className="text-xs sm:text-sm font-medium text-gray-400">Lease Remaining</h2>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter tabular-nums text-gray-900 my-2 leading-none">
                {timeLeft > 0 ? (
                  `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                ) : "00:00"}
                </div>

                <div className="mt-auto space-y-2">
                  <div className="h-1.5 rounded-full bg-gray-200/80 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${leaseProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${timeLeft > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500">
                        {timeLeft > 0 ? "Compute Link Established" : "Awaiting Provisioning"}
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-400">{leaseProgress.toFixed(0)}%</span>
                  </div>
                </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 content-start">
                  <div className="bg-white/85 border border-white rounded-xl p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selected</p>
                    <p className="text-sm font-bold text-gray-700">{customInput || 0} min</p>
                  </div>
                  <div className="bg-white/85 border border-white rounded-xl p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Lease</p>
                    <p className="text-sm font-bold text-gray-700">{totalHours} hrs</p>
                  </div>
                  <div className="bg-white/85 border border-white rounded-xl p-2.5 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sync</p>
                    <p className="text-sm font-bold text-gray-700">every 30s</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SMALL TILE: DURATION INPUT + QUICK SETS */}
            <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-2xl sm:rounded-3xl p-3 shadow-xl shadow-gray-200/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-200/60">
              <label className="text-[9px] font-bold uppercase text-gray-400 block">Minutes</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={customInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-bold focus:outline-none placeholder-gray-200 leading-none pr-8"
                  placeholder="0"
                />
                <button
                  onClick={() => handleInputChange("0")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-gray-400 hover:text-gray-600 transition-colors text-xs font-bold"
                  title="Clear"
                >
                  ✕
                </button>
              </div>
              <div className="mt-1.5">
                <p className="text-[8px] font-bold uppercase text-gray-400 block mb-1">Quick Sets</p>
                <div className="flex flex-wrap gap-1">
                  {[15, 60, 240, 720].map(m => (
                    <button
                      key={m}
                      onClick={() => handleInputChange(m.toString())}
                      className="px-1.5 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 text-[9px] font-bold text-blue-700 transition-colors"
                    >
                      {m >= 60 ? `${m/60}h` : `${m}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SMALL TILE: HOUR CONVERSION */}
            <div className="bg-emerald-600 text-white rounded-2xl sm:rounded-3xl p-4 shadow-xl shadow-emerald-500/20 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-400/40">
              <label className="text-[10px] font-bold uppercase opacity-60 block tracking-widest">Total Lease</label>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                {totalHours} <span className="text-base sm:text-lg opacity-80 font-medium tracking-normal">hrs</span>
              </div>
              <p className="text-[11px] font-semibold opacity-70">{customInput || 0} minutes selected</p>
            </div>

            {/* COMPACT CONTROLS: ACTION + PRESETS */}
            <div className="md:col-span-2 self-start py-1">
              <button
                onClick={async () => {
                  setLoading(true);
                  try { await buyAccess(address, duration); await sync(address); }
                  catch (e) { alert("Blockchain interaction failed."); }
                  setLoading(false);
                }}
                disabled={loading}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-sm font-bold tracking-tight shadow-lg hover:bg-emerald-900 disabled:bg-gray-700"
              >
                {loading ? "Authorizing..." : "Confirm & Lease Compute"}
              </button>
            </div>



          </div>
        )}

          <footer className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center px-2 sm:px-4">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v1.0 DePIN Prototype</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stellar Testnet 2026</p>
        </footer>
      </div>
    </main>
  );
}