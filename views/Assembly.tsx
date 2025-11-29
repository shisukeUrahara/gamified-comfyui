import React, { useState } from 'react';
import { NodeCard } from '../components/NodeCard';
import { ArrowRight, Check, Hammer } from 'lucide-react';

const STEPS = [
  {
    title: "The Foundation",
    description: "Every machine needs a power source and a brain. Place the Load Checkpoint node.",
    requiredNode: "Load Checkpoint"
  },
  {
    title: "The Directives",
    description: "The robot needs instructions. We need TWO translators: one for what we want (Positive) and one for what we don't (Negative).",
    requiredNode: "CLIP Text Encode"
  },
  {
    title: "The Canvas",
    description: "Before the robot can paint, it needs a substrate. Generate a blank noise field.",
    requiredNode: "Empty Latent Image"
  },
  {
    title: "The Processor",
    description: "The Hand that draws. The KSampler takes the Brain, The Prompts, and The Canvas to do the work.",
    requiredNode: "KSampler"
  },
  {
    title: "The Printer",
    description: "The latent dream must be developed into pixels we can see.",
    requiredNode: "VAE Decode"
  }
];

export const Assembly: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [placedNodes, setPlacedNodes] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const handlePlaceNode = () => {
    const nodeName = STEPS[currentStep].requiredNode;
    setPlacedNodes([...placedNodes, nodeName]);
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Unit Type 01: "The Scout"</h2>
          <p className="text-slate-400">Mission Profile: Generate a high-quality image from a text description (Text-to-Image).</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 font-mono">ASSEMBLY PROGRESS</div>
          <div className="text-2xl font-bold text-cyan-400">{(completed ? 100 : (currentStep / STEPS.length) * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Instructions Panel */}
        <div className="w-1/3 bg-slate-900 border border-slate-700 p-6 rounded-xl flex flex-col">
          {!completed ? (
            <>
              <div className="flex items-center gap-3 text-cyan-400 mb-4">
                <Hammer size={24} />
                <h3 className="font-bold text-lg">Step {currentStep + 1}: {STEPS[currentStep].title}</h3>
              </div>
              <p className="text-slate-300 mb-8 leading-relaxed">
                {STEPS[currentStep].description}
              </p>
              
              <div className="mt-auto">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-4">
                  <div className="text-xs text-slate-500 uppercase mb-2">Required Component</div>
                  <div className="font-mono text-white font-bold">{STEPS[currentStep].requiredNode}</div>
                </div>
                <button 
                  onClick={handlePlaceNode}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                  Install Component <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Assembly Complete</h3>
              <p className="text-slate-400 mb-6">The Scout is online and ready for activation.</p>
              <button 
                onClick={() => { setCurrentStep(0); setPlacedNodes([]); setCompleted(false); }}
                className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-lg"
              >
                Disassemble & Restart
              </button>
            </div>
          )}
        </div>

        {/* Workbench Visualizer */}
        <div className="flex-1 bg-slate-950 rounded-xl border-2 border-slate-800 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-900/90 pointer-events-none" />
          
          <div className="relative z-10 p-8 h-full overflow-y-auto">
             {/* This is a simplified "Flow" layout using absolute positioning simulation or flex for simplicity */}
             <div className="flex flex-wrap items-center justify-center gap-8 h-full content-center">
                {placedNodes.includes("Load Checkpoint") && (
                  <NodeCard 
                    title="Load Checkpoint" 
                    category="loader" 
                    inputs={[]} 
                    outputs={[{name: 'MODEL', type: 'MODEL'}, {name: 'CLIP', type: 'CLIP'}, {name: 'VAE', type: 'VAE'}]}
                    compact
                  />
                )}
                
                {placedNodes.includes("CLIP Text Encode") && (
                  <div className="space-y-4">
                     <NodeCard 
                      title="CLIP Text (Positive)" 
                      category="conditioning" 
                      inputs={[{name: 'clip', type: 'CLIP'}]} 
                      outputs={[{name: 'CONDITIONING', type: 'CONDITIONING'}]}
                      compact
                    />
                     <NodeCard 
                      title="CLIP Text (Negative)" 
                      category="conditioning" 
                      inputs={[{name: 'clip', type: 'CLIP'}]} 
                      outputs={[{name: 'CONDITIONING', type: 'CONDITIONING'}]}
                      compact
                    />
                  </div>
                )}

                {placedNodes.includes("Empty Latent Image") && (
                  <NodeCard 
                    title="Empty Latent" 
                    category="latent" 
                    outputs={[{name: 'LATENT', type: 'LATENT'}]}
                    compact
                  />
                )}

                {placedNodes.includes("KSampler") && (
                  <NodeCard 
                    title="KSampler" 
                    category="sampling" 
                    inputs={[{name: 'model', type: 'MODEL'}, {name: '+', type: 'CONDITIONING'}, {name: '-', type: 'CONDITIONING'}, {name: 'latent', type: 'LATENT'}]} 
                    outputs={[{name: 'LATENT', type: 'LATENT'}]}
                    compact
                  />
                )}

                {placedNodes.includes("VAE Decode") && (
                  <NodeCard 
                    title="VAE Decode" 
                    category="image" 
                    inputs={[{name: 'samples', type: 'LATENT'}, {name: 'vae', type: 'VAE'}]} 
                    outputs={[{name: 'IMAGE', type: 'IMAGE'}]}
                    compact
                  />
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};