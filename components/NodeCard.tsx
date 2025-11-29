import React from 'react';
import { ComfyNode, ConnectionColor } from '../types';

interface NodeCardProps {
  title: string;
  category: string;
  inputs?: { name: string; type: string }[];
  outputs?: { name: string; type: string }[];
  description?: string;
  compact?: boolean;
}

const getColorForType = (type: string): string => {
  const t = type.toUpperCase();
  if (t.includes('MODEL')) return ConnectionColor.MODEL;
  if (t.includes('CLIP')) return ConnectionColor.CLIP;
  if (t.includes('VAE')) return ConnectionColor.VAE;
  if (t.includes('CONDITIONING')) return ConnectionColor.CONDITIONING;
  if (t.includes('LATENT')) return ConnectionColor.LATENT;
  if (t.includes('IMAGE')) return ConnectionColor.IMAGE;
  if (t.includes('MASK')) return ConnectionColor.MASK;
  return 'bg-gray-500';
};

export const NodeCard: React.FC<NodeCardProps> = ({ title, category, inputs = [], outputs = [], description, compact = false }) => {
  return (
    <div className={`bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden min-w-[200px] ${compact ? 'w-48' : 'w-64'} transition-transform hover:scale-[1.02]`}>
      <div className="bg-slate-700 p-2 border-b border-slate-600 flex justify-between items-center">
        <span className="font-bold text-slate-100 text-sm truncate">{title}</span>
        <span className="text-[10px] uppercase text-slate-400 font-mono tracking-tighter">{category}</span>
      </div>
      
      <div className={`p-3 space-y-4 ${compact ? 'text-xs' : 'text-sm'}`}>
        {/* Description */}
        {!compact && description && (
          <p className="text-slate-400 text-xs italic leading-tight mb-2 border-b border-slate-700 pb-2">
            {description}
          </p>
        )}

        {/* Inputs and Outputs Container */}
        <div className="flex justify-between gap-4">
          {/* Inputs (Left side) */}
          <div className="flex flex-col gap-2 w-1/2">
            {inputs.map((input, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getColorForType(input.type)} shadow-[0_0_5px_rgba(0,0,0,0.5)]`} />
                <span className="text-slate-300 truncate">{input.name}</span>
              </div>
            ))}
          </div>

          {/* Outputs (Right side) */}
          <div className="flex flex-col gap-2 w-1/2 items-end">
            {outputs.map((output, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-row-reverse text-right">
                <div className={`w-3 h-3 rounded-full ${getColorForType(output.type)} shadow-[0_0_5px_rgba(0,0,0,0.5)]`} />
                <span className="text-slate-300 truncate">{output.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};