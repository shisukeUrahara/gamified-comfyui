import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ModuleId } from './types';
import { Introduction } from './views/Introduction';
import { Physics } from './views/Physics';
import { PartsBin } from './views/PartsBin';
import { Workshop3D } from './views/Workshop3D';
import { Decoder } from './views/Decoder';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleId>(ModuleId.INTRO);

  const renderModule = () => {
    switch (currentModule) {
      case ModuleId.INTRO:
        return <Introduction onComplete={() => setCurrentModule(ModuleId.PHYSICS)} />;
      case ModuleId.PHYSICS:
        return <Physics />;
      case ModuleId.PARTS:
        return <PartsBin />;
      case ModuleId.WORKSHOP_3D:
        return <Workshop3D />;
      case ModuleId.DECODER:
        return <Decoder />;
      default:
        return <Introduction onComplete={() => setCurrentModule(ModuleId.PHYSICS)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar 
        currentModule={currentModule} 
        onNavigate={setCurrentModule} 
      />
      
      <main className="flex-1 overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        
        {/* Render content directly - specific modules handle their own padding/scroll */}
        {renderModule()}
      </main>
    </div>
  );
};

export default App;