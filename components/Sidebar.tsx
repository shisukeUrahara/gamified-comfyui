import React from 'react';
import { ModuleId, NavItem } from '../types';
import { BookOpen, Zap, Box, Hammer, Code, BoxSelect } from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleId;
  onNavigate: (id: ModuleId) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: ModuleId.INTRO, label: 'The Workshop', icon: BookOpen, description: 'Entering the paradigm' },
  { id: ModuleId.PHYSICS, label: 'Energy Physics', icon: Zap, description: 'Data Types & Flow' },
  { id: ModuleId.PARTS, label: 'Parts Bin', icon: Box, description: 'Component Specs' },
  { id: ModuleId.WORKSHOP_3D, label: '3D Assembly', icon: BoxSelect, description: 'Robot Builder Sim' }, // Updated
  { id: ModuleId.DECODER, label: 'The Matrix', icon: Code, description: 'JSON Decoder' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-screen shrink-0 z-20">
      <div className="p-6 border-b border-slate-700 bg-slate-950">
        <h1 className="font-bold text-cyan-400 tracking-wider text-sm uppercase">Artificer's Handbook</h1>
        <p className="text-xs text-slate-500 mt-1 font-mono">v1.1.0 // 3D_ENGINE</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left p-3 rounded-lg group transition-all duration-200 border border-transparent
              ${currentModule === item.id 
                ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                : 'hover:bg-slate-800 hover:border-slate-700'
              }
            `}
          >
            <div className="flex items-center gap-3 mb-1">
              <item.icon 
                size={18} 
                className={currentModule === item.id ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'} 
              />
              <span className={`font-semibold text-sm ${currentModule === item.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {item.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pl-8 leading-tight">
              {item.description}
            </p>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-950">
        <div className="bg-slate-900 rounded p-3 text-xs text-slate-400 font-mono border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            SYSTEM ONLINE
          </div>
          <div>User: Architect</div>
          <div>Mode: Learning</div>
        </div>
      </div>
    </div>
  );
};