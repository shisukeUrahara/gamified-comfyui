import React, { useState } from 'react';
import { ComfyUIJSON } from '../types';
import { FileCode, AlertCircle, FileJson } from 'lucide-react';

export const Decoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [data, setData] = useState<ComfyUIJSON | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.nodes || !parsed.links) {
        throw new Error("Invalid ComfyUI JSON format. Missing 'nodes' or 'links'.");
      }
      setData(parsed);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setData(null);
    }
  };

  const getLinkCounts = () => {
    if (!data) return [];
    const counts: Record<string, number> = {};
    data.links.forEach(link => {
      const type = link[5]; // The type string is index 5
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Hacking the Matrix</h2>
        <p className="text-slate-400">Decode the digital DNA. Paste a ComfyUI JSON file to analyze its structure.</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Input Area */}
        <div className="w-1/2 flex flex-col">
          <textarea
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
            placeholder="Paste workflow.json here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleDecode}
            className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileCode size={18} /> Decode Workflow
          </button>
        </div>

        {/* Output Area */}
        <div className="w-1/2 bg-slate-800 rounded-lg border border-slate-700 p-6 overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1">Decoding Failed</strong>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {!data && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <FileJson size={48} className="mb-4 opacity-50" />
              <p>Awaiting Data Stream...</p>
            </div>
          )}

          {data && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{data.nodes.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Nodes</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{data.links.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Connections</div>
                </div>
              </div>

              {/* Energy Flow Analysis */}
              <div>
                <h3 className="text-slate-300 font-bold mb-3 text-sm uppercase">Energy Flow Analysis</h3>
                <div className="space-y-2">
                  {getLinkCounts().map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between bg-slate-900/50 px-3 py-2 rounded border border-slate-700">
                      <span className="font-mono text-sm text-cyan-300">{type}</span>
                      <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node Manifest */}
              <div>
                <h3 className="text-slate-300 font-bold mb-3 text-sm uppercase">Component Manifest</h3>
                <div className="space-y-2">
                  {data.nodes.map(node => (
                    <div key={node.id} className="bg-slate-700 p-3 rounded flex justify-between items-center group hover:bg-slate-600 transition-colors">
                      <div>
                        <div className="font-bold text-white text-sm">{node.type}</div>
                        <div className="text-xs text-slate-400 font-mono">ID: {node.id}</div>
                      </div>
                      <div className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                         Inputs: {node.inputs?.length || 0} / Outputs: {node.outputs?.length || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};