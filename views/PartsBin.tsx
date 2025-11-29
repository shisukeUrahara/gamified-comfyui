import React, { useState } from 'react';
import { NodeCard } from '../components/NodeCard';
import { Database, Eye, Brain, PenTool, Image as ImageIcon, Zap } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Parts', icon: Database },
  { id: 'loader', label: 'Loaders (Source)', icon: Zap },
  { id: 'conditioning', label: 'Conditioning (Directives)', icon: PenTool },
  { id: 'latent', label: 'Latent (Workshop)', icon: Brain },
  { id: 'image', label: 'Image (Output)', icon: ImageIcon },
];

const NODES_DATA = [
  {
    title: 'Load Checkpoint',
    category: 'loader',
    inputs: [{ name: 'ckpt_name', type: 'string' }],
    outputs: [{ name: 'MODEL', type: 'MODEL' }, { name: 'CLIP', type: 'CLIP' }, { name: 'VAE', type: 'VAE' }],
    description: 'The Central Cortex. Unpacks the "Model Bundle" containing the Brain, Translator, and Eyes.'
  },
  {
    title: 'Load LoRA',
    category: 'loader',
    inputs: [{ name: 'model', type: 'MODEL' }, { name: 'clip', type: 'CLIP' }],
    outputs: [{ name: 'MODEL', type: 'MODEL' }, { name: 'CLIP', type: 'CLIP' }],
    description: 'The Skill Chip. Modifies the brain to specialize in a style (e.g., Anime, Charcoal).'
  },
  {
    title: 'CLIP Text Encode',
    category: 'conditioning',
    inputs: [{ name: 'clip', type: 'CLIP' }, { name: 'text', type: 'string' }],
    outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING' }],
    description: 'The Translator. Converts English words into "Attractor" (Positive) or "Repulsor" (Negative) signals.'
  },
  {
    title: 'Empty Latent Image',
    category: 'latent',
    inputs: [{ name: 'width', type: 'INT' }, { name: 'height', type: 'INT' }],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
    description: 'The Blank Canvas. Generates a block of pure noise for the robot to sculpt.'
  },
  {
    title: 'VAE Encode',
    category: 'latent',
    inputs: [{ name: 'pixels', type: 'IMAGE' }, { name: 'vae', type: 'VAE' }],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
    description: 'The Scanner. Compresses a pixel image into the "Dream State" (Latent).'
  },
  {
    title: 'KSampler',
    category: 'sampling',
    inputs: [
      { name: 'model', type: 'MODEL' },
      { name: 'positive', type: 'CONDITIONING' },
      { name: 'negative', type: 'CONDITIONING' },
      { name: 'latent_image', type: 'LATENT' }
    ],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
    description: 'The Hand. The complex engine that performs the denoising process to create the image.'
  },
  {
    title: 'VAE Decode',
    category: 'image',
    inputs: [{ name: 'samples', type: 'LATENT' }, { name: 'vae', type: 'VAE' }],
    outputs: [{ name: 'IMAGE', type: 'IMAGE' }],
    description: 'The Printer. Expands the finished dream back into viewable pixels.'
  },
  {
    title: 'Save Image',
    category: 'image',
    inputs: [{ name: 'images', type: 'IMAGE' }],
    outputs: [],
    description: 'The Archive. Saves the final result to disk.'
  }
];

export const PartsBin: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNodes = activeCategory === 'all' 
    ? NODES_DATA 
    : NODES_DATA.filter(n => n.category === activeCategory || (activeCategory === 'latent' && n.category === 'sampling'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">The Parts Bin</h2>
        <p className="text-slate-400">Inventory of available components. Hover over a card to inspect its schematic.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors
              ${activeCategory === cat.id 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNodes.map((node, index) => (
          <NodeCard
            key={index}
            title={node.title}
            category={node.category}
            inputs={node.inputs}
            outputs={node.outputs}
            description={node.description}
          />
        ))}
      </div>
    </div>
  );
};