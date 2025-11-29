import React, { useState } from 'react';
import { DataTypeInfo, ConnectionColor } from '../types';
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

const DATA_TYPES: DataTypeInfo[] = [
  { name: 'MODEL', colorClass: ConnectionColor.MODEL, analogy: 'The Neural Synapses', description: 'Raw intelligence, weights, and training data.' },
  { name: 'CLIP', colorClass: ConnectionColor.CLIP, analogy: 'The Linguistics Module', description: 'Translates language into mathematical concepts.' },
  { name: 'VAE', colorClass: ConnectionColor.VAE, analogy: 'The Optical Sensor', description: 'Translates between compressed dream world and pixel world.' },
  { name: 'CONDITIONING', colorClass: ConnectionColor.CONDITIONING, analogy: 'The Command Signal', description: 'Vector instructions: "Move toward this concept".' },
  { name: 'LATENT', colorClass: ConnectionColor.LATENT, analogy: 'The Dream State', description: 'Compressed mathematical representation (Ghosts).' },
  { name: 'IMAGE', colorClass: ConnectionColor.IMAGE, analogy: 'The Visual Output', description: 'Standard pixel data human eyes can see.' },
];

export const Physics: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleSourceClick = (name: string) => {
    if (matches.has(name)) return;
    setSelectedSource(name);
    setError(null);
  };

  const handleTargetClick = (name: string) => {
    if (matches.has(name)) return;
    
    if (!selectedSource) {
      setError("Select a source (Left) energy type first.");
      return;
    }

    if (selectedSource === name) {
      const newMatches = new Set(matches);
      newMatches.add(name);
      setMatches(newMatches);
      setSelectedSource(null);
      setError(null);
    } else {
      setError("Incompatible Energy! Structural Failure imminent.");
      setTimeout(() => setError(null), 1500);
    }
  };

  const resetGame = () => {
    setMatches(new Set());
    setSelectedSource(null);
    setError(null);
  };

  const isComplete = matches.size === DATA_TYPES.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">The Physics of the Digital Realm</h2>
        <p className="text-slate-400">
          The Law of Compatibility: A wire can only connect an Output of one color to an Input of the same color.
          <br/>Connect the matching energy streams to stabilize the workshop.
        </p>
      </div>

      <div className="flex justify-between items-start gap-12 bg-slate-900/50 p-8 rounded-2xl border border-slate-700 relative">
        {/* Source Column */}
        <div className="space-y-4 flex-1">
          <h3 className="text-center text-slate-500 font-mono text-sm uppercase mb-4">Source Output</h3>
          {DATA_TYPES.map((type) => (
            <button
              key={`src-${type.name}`}
              onClick={() => handleSourceClick(type.name)}
              disabled={matches.has(type.name)}
              className={`w-full p-4 rounded-lg border-2 flex items-center justify-between group transition-all
                ${matches.has(type.name) ? 'border-green-500/30 bg-green-900/10 opacity-50' : 
                  selectedSource === type.name ? 'border-cyan-400 bg-slate-800' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}
              `}
            >
              <div className="text-left">
                <div className="font-bold text-slate-200">{type.name}</div>
                <div className="text-xs text-slate-500">{type.analogy}</div>
              </div>
              <div className={`w-4 h-4 rounded-full ${type.colorClass} shadow-[0_0_8px_rgba(255,255,255,0.3)] ring-2 ring-slate-800`} />
            </button>
          ))}
        </div>

        {/* Central Feedback Area */}
        <div className="w-1/3 flex flex-col items-center justify-center min-h-[400px]">
          {error ? (
            <div className="text-red-400 flex flex-col items-center animate-pulse text-center">
              <XCircle size={48} className="mb-2" />
              <span className="font-mono font-bold">CONNECTION FAILED</span>
              <span className="text-sm">{error}</span>
            </div>
          ) : isComplete ? (
            <div className="text-green-400 flex flex-col items-center animate-in zoom-in duration-500 text-center">
              <CheckCircle2 size={64} className="mb-4" />
              <span className="font-mono font-bold text-xl">SYSTEM STABILIZED</span>
              <p className="text-slate-400 text-sm mt-2">You understand the flow of energy.</p>
              <button onClick={resetGame} className="mt-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <RefreshCcw size={16} /> Reset Simulation
              </button>
            </div>
          ) : (
            <div className="text-slate-600 text-center font-mono text-sm">
              Waiting for connection...
              <div className="h-px w-full bg-slate-700 my-4"></div>
              {selectedSource && <span className="text-cyan-500 animate-pulse">Routing {selectedSource}...</span>}
            </div>
          )}
        </div>

        {/* Target Column */}
        <div className="space-y-4 flex-1">
          <h3 className="text-center text-slate-500 font-mono text-sm uppercase mb-4">Target Input</h3>
          {/* Shuffle visually by mapping in a different order, but logically same keys */}
          {[...DATA_TYPES].sort((a, b) => a.name.length - b.name.length).map((type) => (
            <button
              key={`tgt-${type.name}`}
              onClick={() => handleTargetClick(type.name)}
              disabled={matches.has(type.name)}
              className={`w-full p-4 rounded-lg border-2 flex items-center justify-between flex-row-reverse group transition-all
                ${matches.has(type.name) ? 'border-green-500/30 bg-green-900/10 opacity-50' : 
                  'border-slate-700 bg-slate-800 hover:border-slate-500'}
              `}
            >
              <div className="text-right">
                <div className="font-bold text-slate-200">{type.name}</div>
                <div className="text-xs text-slate-500">{type.description}</div>
              </div>
              <div className={`w-4 h-4 rounded-full ${type.colorClass} shadow-[0_0_8px_rgba(255,255,255,0.3)] ring-2 ring-slate-800`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};