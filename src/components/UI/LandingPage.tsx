'use client';

import { useGameStore } from '@/store/GameStore';
import { Terminal, Shield, Cpu, Play } from 'lucide-react';

export function LandingPage() {
    const setAppState = useGameStore((state) => state.setAppState);

    const handleInitialize = () => {
        setAppState('scenario-selection');
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/20 font-sans text-white overflow-hidden pointer-events-none">
            {/* Holographic Overlay Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Scanning Line Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-[2px] bg-blue-400/30 blur-[1px] absolute top-0 animate-[scan_4s_ease-in-out_infinite]" />
            </div>

            {/* Main Holographic Panel */}
            <div className="relative z-10 p-12 md:p-16 flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in duration-1000 pointer-events-auto
                            bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10
                            before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/5 before:pointer-events-none">

                {/* HUD Elements */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-green-500 tracking-widest uppercase">System Online</span>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-mono text-blue-400 tracking-widest uppercase opacity-70">
                    Net: Secure
                </div>
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                    CPU: Nominal
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                    Mem: Optimized
                </div>

                {/* Logo / Icon Glitch Group */}
                <div className="flex gap-6 mb-2 relative">
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full" />
                    <Shield className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <Cpu className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    <Terminal className="w-14 h-14 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                </div>

                {/* Title with 3D Depth */}
                <div className="space-y-4">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-2xl translate-z-10">
                        CLOUD
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
                        <span className="text-2xl md:text-4xl tracking-[0.5em] text-yellow-400 font-bold uppercase drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                            The Game
                        </span>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
                    </div>
                </div>

                {/* Tagline */}
                <p className="text-blue-200/80 text-lg md:text-xl tracking-widest font-mono uppercase opacity-90 mt-4">
                    Architect <span className="text-blue-500 mx-2">•</span> Scale <span className="text-blue-500 mx-2">•</span> Survive
                </p>

                {/* Initialize Button */}
                <button
                    onClick={handleInitialize}
                    className="group relative px-10 py-5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 rounded-lg mt-8 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                    <span className="relative flex items-center gap-3 font-mono text-xl font-bold tracking-widest text-white group-hover:text-blue-200 transition-colors">
                        <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
                        INITIALIZE_SYSTEM
                    </span>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase opacity-60">
                Resilience Engine V3.0  //  Connection Established
            </div>


        </div>
    );
}
