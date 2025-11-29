import React from 'react';
import { ArrowRight, Box, Cpu, Layers } from 'lucide-react';

interface IntroductionProps {
  onComplete: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          The Artificer’s Handbook
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Welcome to the Workshop. We are moving past the era of static "black-box" appliances.
          You are no longer just a prompter; you are an engineer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
          <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 text-purple-400">
            <Cpu size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Build The Machine</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Treat image generation as a manufacturing process. Identify the "Brain", "Eyes", and "Hands" of your automaton.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-colors">
          <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
            <Layers size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Flow of Energy</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Understand the color-coded "fluids" (Data Types) that flow through the wires. Connect the right ports to avoid catastrophic failure.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-red-500/50 transition-colors">
          <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center mb-4 text-red-400">
            <Box size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Component Logic</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Demystify the spaghetti. Learn the function of every node in the Parts Bin, from Checkpoints to KSamplers.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={120} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Your Mission</h2>
        <p className="text-slate-300 mb-6">
          By the end of this handbook, you will possess the knowledge to visualize a "Scout" (Text-to-Image),
          a "Mimic" (Img2Img), or a "Surgeon" (Inpainting) on an empty canvas. You are becoming a Master Architect.
        </p>
        <button 
          onClick={onComplete}
          className="group flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25"
        >
          Enter the Workshop
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};