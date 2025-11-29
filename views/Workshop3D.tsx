import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Grid, RoundedBox, Sparkles, Environment, ContactShadows, QuadraticBezierLine } from '@react-three/drei';
import { ColorHex, ConnectionColor } from '../types';
import { Check, ChevronRight, ChevronLeft, Info, RotateCcw, X, Zap } from 'lucide-react';
import * as THREE from 'three';

// --- TYPES & DATA ---

interface NodeSpec {
  id: string;
  title: string;
  category: string;
  analogy: string;
  description: string;
  inputs: { name: string; type: keyof typeof ConnectionColor }[];
  outputs: { name: string; type: keyof typeof ConnectionColor }[];
  position: [number, number, number];
  partType: 'chassis' | 'torso' | 'head' | 'antenna' | 'visor' | 'hologram';
}

const LESSON_NODES: Record<string, NodeSpec> = {
  'checkpoint': {
    id: 'checkpoint',
    title: 'Load Checkpoint',
    category: 'Loader',
    analogy: 'The Power Core & Torso',
    description: 'The central hub that contains the model weights (The Brain), the CLIP model (The Translator), and the VAE (The Eyes). Without this, the robot has no knowledge.',
    inputs: [],
    outputs: [{ name: 'MODEL', type: 'MODEL' }, { name: 'CLIP', type: 'CLIP' }, { name: 'VAE', type: 'VAE' }],
    position: [0, 0, 0],
    partType: 'torso'
  },
  'clip_text': {
    id: 'clip_text',
    title: 'CLIP Text Encode',
    category: 'Conditioning',
    analogy: 'The Antennae (Sensors)',
    description: 'Receives human language (prompts) and converts it into "Conditioning" - mathematical vectors that guide the robot toward or away from concepts.',
    inputs: [{ name: 'clip', type: 'CLIP' }, { name: 'text', type: 'MODEL' }], // simplified type
    outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING' }],
    position: [0, 1.2, 0],
    partType: 'antenna'
  },
  'empty_latent': {
    id: 'empty_latent',
    title: 'Empty Latent Image',
    category: 'Latent',
    analogy: 'The Holographic Canvas',
    description: 'Generates a "Latent" field of pure noise. This is the raw material from which the image will be sculpted. It is not yet visible pixels.',
    inputs: [],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
    position: [2.5, 0, 1],
    partType: 'hologram'
  },
  'ksampler': {
    id: 'ksampler',
    title: 'KSampler',
    category: 'Sampling',
    analogy: 'The Brain (Processor)',
    description: 'The engine of the robot. It takes the Model (intelligence), Conditioning (instructions), and Latent (canvas) to iteratively remove noise and reveal the image.',
    inputs: [{ name: 'model', type: 'MODEL' }, { name: 'positive', type: 'CONDITIONING' }, { name: 'negative', type: 'CONDITIONING' }, { name: 'latent', type: 'LATENT' }],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
    position: [0, 2.2, 0],
    partType: 'head'
  },
  'vae_decode': {
    id: 'vae_decode',
    title: 'VAE Decode',
    category: 'Image',
    analogy: 'The Visor (Eyes)',
    description: 'The Variational Autoencoder. It takes the finished Latent "dream" and expands it into actual RGB pixels that humans can see.',
    inputs: [{ name: 'samples', type: 'LATENT' }, { name: 'vae', type: 'VAE' }],
    outputs: [{ name: 'IMAGE', type: 'IMAGE' }],
    position: [0, 2.2, 0.8],
    partType: 'visor'
  }
};

const STEPS = [
  {
    id: 'step1',
    nodeId: 'checkpoint',
    instruction: 'Install the Power Core (Checkpoint). This provides the raw intelligence.',
    cameraPos: [4, 2, 4]
  },
  {
    id: 'step2',
    nodeId: 'clip_text',
    instruction: 'Attach the Antennae (CLIP). These translate your text prompts.',
    cameraPos: [3, 3, 3]
  },
  {
    id: 'step3',
    nodeId: 'empty_latent',
    instruction: 'Initialize the Hologram (Latent). This is the noise canvas.',
    cameraPos: [4, 1, 1]
  },
  {
    id: 'step4',
    nodeId: 'ksampler',
    instruction: 'Mount the Head (KSampler). This creates the processing unit.',
    cameraPos: [2, 3, 5]
  },
  {
    id: 'step5',
    nodeId: 'vae_decode',
    instruction: 'Equip the Visor (VAE). This allows the robot to "see" (render) the result.',
    cameraPos: [0, 2, 6]
  }
];

// --- 3D COMPONENTS ---

interface AnimatedCableProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  active: boolean;
}

const AnimatedCable: React.FC<AnimatedCableProps> = ({ start, end, color, active }) => {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current && active) {
      ref.current.material.dashOffset -= 0.02;
    }
  });

  const curve = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    // Control point for curve - lift it up a bit between points
    const mid = p1.clone().lerp(p2, 0.5);
    mid.y += 0.5 + Math.random() * 0.5; 
    return [p1, mid, p2];
  }, [start, end]);

  if (!active) return null;

  return (
    <QuadraticBezierLine
      ref={ref}
      start={curve[0] as any}
      mid={curve[1] as any}
      end={curve[2] as any}
      color={color}
      lineWidth={3}
      dashed
      dashScale={2}
      gapSize={1}
    />
  );
};

interface RobotPartMeshProps {
  type: string;
  active: boolean;
  onClick: () => void;
  selected: boolean;
}

const RobotPartMesh: React.FC<RobotPartMeshProps> = ({ type, active, onClick, selected }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Animation for "popping in"
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = active ? 1 : 0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (selected && meshRef.current) {
       meshRef.current.rotation.y += 0.01;
    } else if (meshRef.current) {
       meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }
  });

  const selectionMaterial = selected ? { emissive: "#06b6d4", emissiveIntensity: 0.5 } : {};

  return (
    <group ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {type === 'torso' && (
        <group position={[0, 0, 0]}>
          {/* Main Core Body */}
          <RoundedBox args={[1.4, 1.8, 1]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.2} clearcoat={1} {...selectionMaterial} />
          </RoundedBox>
          {/* Glowing Core */}
          <mesh position={[0, 0.2, 0.51]}>
             <circleGeometry args={[0.3, 32]} />
             <meshBasicMaterial color={ColorHex.MODEL} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.2, 0.6]} color={ColorHex.MODEL} intensity={2} distance={3} />
          {/* Side Ports */}
          <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, -Math.PI/2]}>
             <cylinderGeometry args={[0.2, 0.2, 0.2]} />
             <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[-0.7, 0.5, 0]} rotation={[0, 0, Math.PI/2]}>
             <cylinderGeometry args={[0.2, 0.2, 0.2]} />
             <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      )}

      {type === 'antenna' && (
        <group position={[0, 1.1, 0]}>
           <mesh position={[-0.8, 0.8, 0]} rotation={[0, 0, 0.3]}>
             <cylinderGeometry args={[0.05, 0.1, 1.5]} />
             <meshStandardMaterial color="#eab308" metalness={1} roughness={0.2} {...selectionMaterial} />
           </mesh>
           <mesh position={[0.8, 0.8, 0]} rotation={[0, 0, -0.3]}>
             <cylinderGeometry args={[0.05, 0.1, 1.5]} />
             <meshStandardMaterial color="#eab308" metalness={1} roughness={0.2} {...selectionMaterial} />
           </mesh>
           <mesh position={[-0.8, 1.6, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#fef08a" />
           </mesh>
           <mesh position={[0.8, 1.6, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#fef08a" />
           </mesh>
        </group>
      )}

      {type === 'head' && (
        <group position={[0, 2.3, 0]}>
          <RoundedBox args={[1, 0.9, 1]} radius={0.2} smoothness={4}>
            <meshPhysicalMaterial color="#ffffff" metalness={0.5} roughness={0.1} {...selectionMaterial} />
          </RoundedBox>
          {/* Neck */}
          <mesh position={[0, -0.6, 0]}>
             <cylinderGeometry args={[0.3, 0.3, 0.5]} />
             <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Brain Window */}
          <mesh position={[0, 0.55, 0]}>
             <boxGeometry args={[0.6, 0.1, 0.6]} />
             <meshBasicMaterial color={ColorHex.LATENT} transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {type === 'visor' && (
        <group position={[0, 2.3, 0.55]}>
           <RoundedBox args={[1.1, 0.35, 0.1]} radius={0.05}>
              <meshPhysicalMaterial color="#000000" metalness={1} roughness={0} />
           </RoundedBox>
           <mesh position={[-0.25, 0, 0.06]}>
              <circleGeometry args={[0.1]} />
              <meshBasicMaterial color={ColorHex.IMAGE} toneMapped={false} />
           </mesh>
           <mesh position={[0.25, 0, 0.06]}>
              <circleGeometry args={[0.1]} />
              <meshBasicMaterial color={ColorHex.IMAGE} toneMapped={false} />
           </mesh>
        </group>
      )}

      {type === 'hologram' && (
        <group position={[2.5, 0, 1]}>
           <mesh position={[0, -0.9, 0]}>
              <cylinderGeometry args={[0.5, 0.8, 0.2]} />
              <meshStandardMaterial color="#1e293b" />
           </mesh>
           <Float speed={2}>
             <mesh position={[0, 0.5, 0]} rotation={[Math.PI/4, Math.PI/4, 0]}>
               <octahedronGeometry args={[0.8]} />
               <meshBasicMaterial color={ColorHex.LATENT} wireframe transparent opacity={0.3} />
             </mesh>
           </Float>
           <Sparkles count={50} scale={2} size={2} speed={0.4} opacity={0.5} color={ColorHex.LATENT} />
        </group>
      )}
    </group>
  );
};

// --- MAIN COMPONENT ---

export const Workshop3D: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Derive active nodes based on current step
  const activeNodeIds = useMemo(() => {
    return STEPS.slice(0, currentStepIdx + 1).map(s => s.nodeId);
  }, [currentStepIdx]);

  const selectedNodeData = selectedNodeId ? LESSON_NODES[selectedNodeId] : null;

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      // Auto-select the new node for context
      setSelectedNodeId(STEPS[currentStepIdx + 1].nodeId);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  // Determine active cables
  const cables = useMemo(() => {
    const list: { start: [number, number, number], end: [number, number, number], color: string }[] = [];
    if (activeNodeIds.includes('checkpoint') && activeNodeIds.includes('ksampler')) {
      list.push({ start: [0, 0.9, 0], end: [0, 1.8, 0], color: ColorHex.MODEL });
    }
    if (activeNodeIds.includes('clip_text') && activeNodeIds.includes('ksampler')) {
      list.push({ start: [0.8, 1.2, 0], end: [0.5, 2, 0], color: ColorHex.CLIP });
      list.push({ start: [-0.8, 1.2, 0], end: [-0.5, 2, 0], color: ColorHex.CLIP });
    }
    if (activeNodeIds.includes('empty_latent') && activeNodeIds.includes('ksampler')) {
      list.push({ start: [2.5, 0.5, 1], end: [0.6, 2.2, 0.5], color: ColorHex.LATENT });
    }
    if (activeNodeIds.includes('ksampler') && activeNodeIds.includes('vae_decode')) {
      list.push({ start: [0, 2.3, 0], end: [0, 2.3, 0.5], color: ColorHex.LATENT });
    }
    if (activeNodeIds.includes('checkpoint') && activeNodeIds.includes('vae_decode')) {
       // Hidden internal VAE connection simulated
       list.push({ start: [0, 0, 0], end: [0, 2, 0.8], color: ColorHex.VAE });
    }
    return list;
  }, [activeNodeIds]);

  return (
    <div className="w-full h-full relative bg-slate-900 select-none">
      
      {/* 3D Viewport */}
      <div className="absolute inset-0" onClick={() => setSelectedNodeId(null)}>
        <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
          <color attach="background" args={['#0b101a']} />
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} castShadow />
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade />
          
          <group position={[0, -1, 0]}>
            <Grid infiniteGrid sectionColor="#1e293b" cellColor="#0f172a" fadeDistance={30} position={[0, -0.01, 0]} />
            
            {/* Chassis Leg Stand */}
             <group position={[0, -0.8, 0]}>
               <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]}>
                 <ringGeometry args={[1, 1.2, 32]} />
                 <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} transparent opacity={0.5} />
               </mesh>
             </group>

            {/* Robot Parts */}
            {Object.values(LESSON_NODES).map((node) => (
              <RobotPartMesh
                key={node.id}
                type={node.partType}
                active={activeNodeIds.includes(node.id)}
                selected={selectedNodeId === node.id}
                onClick={() => setSelectedNodeId(node.id)}
              />
            ))}

            {/* Cables */}
            {cables.map((cable, idx) => (
               <AnimatedCable key={idx} start={cable.start} end={cable.end} color={cable.color} active={true} />
            ))}
          </group>

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
      </div>

      {/* --- UI LAYOUT --- */}

      {/* Top Left: Title */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-tighter">
            Workshop Level 01
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">THE SCOUT // Text-to-Image Assembler</p>
        </div>
      </div>

      {/* Right Side: Inspector Panel (Conditionally Visible) */}
      <div className={`absolute top-6 bottom-24 right-6 w-80 transition-transform duration-300 ease-in-out z-20 pointer-events-none ${selectedNodeId ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="h-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
          {selectedNodeData && (
            <>
              {/* Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800">
                <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-1">{selectedNodeData.category} Node</div>
                <h2 className="text-xl font-bold text-white">{selectedNodeData.title}</h2>
                <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-xs text-yellow-400 font-mono">
                  <Zap size={12} /> {selectedNodeData.analogy}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Description</h3>
                   <p className="text-sm text-slate-300 leading-relaxed">
                     {selectedNodeData.description}
                   </p>
                </div>

                {/* Ports Visualization */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                      Inputs <span className="text-[10px] bg-slate-800 px-1 rounded">LHS</span>
                    </h3>
                    <div className="space-y-1">
                      {selectedNodeData.inputs.length === 0 ? <span className="text-xs text-slate-600 italic">None (Source)</span> : 
                        selectedNodeData.inputs.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${ConnectionColor[p.type]}`} />
                            <span className="text-xs font-mono text-slate-300">{p.name}</span>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                      Outputs <span className="text-[10px] bg-slate-800 px-1 rounded">RHS</span>
                    </h3>
                    <div className="space-y-1">
                      {selectedNodeData.outputs.length === 0 ? <span className="text-xs text-slate-600 italic">None (Sink)</span> : 
                        selectedNodeData.outputs.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 flex-row-reverse bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${ConnectionColor[p.type]}`} />
                            <span className="text-xs font-mono text-slate-300">{p.name}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={14} /> Close Inspector
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Bar: Progression Controls */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          
          {/* Main Control Deck */}
          <div className="flex-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl pointer-events-auto flex items-center justify-between gap-6">
            
            {/* Nav Prev */}
            <button 
              onClick={handlePrev} 
              disabled={currentStepIdx === 0}
              className={`p-3 rounded-full border transition-all ${currentStepIdx === 0 ? 'border-slate-800 text-slate-700' : 'border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-cyan-500'}`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Step Info */}
            <div className="flex-1 text-center">
               <div className="text-xs font-mono text-cyan-500 mb-1">STEP {currentStepIdx + 1} / {STEPS.length}</div>
               <div className="text-lg font-bold text-white mb-1">{LESSON_NODES[STEPS[currentStepIdx].nodeId].title}</div>
               <p className="text-sm text-slate-400 leading-tight">{STEPS[currentStepIdx].instruction}</p>
            </div>

            {/* Nav Next */}
            {currentStepIdx < STEPS.length - 1 ? (
               <button 
                onClick={handleNext}
                className="group flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white pl-4 pr-3 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/25"
               >
                 Install <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
               </button>
            ) : (
               <button 
                 onClick={() => setCurrentStepIdx(0)} // Temporary reset
                 className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-green-500/25"
               >
                 <RotateCcw size={16} /> Complete
               </button>
            )}

          </div>

          {/* Reset Button (Small) */}
          <button 
            onClick={() => { setCurrentStepIdx(0); setSelectedNodeId(null); }}
            className="pointer-events-auto bg-slate-900/90 hover:bg-red-900/50 text-slate-500 hover:text-red-400 p-4 rounded-2xl border border-slate-800 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};