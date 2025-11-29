import { LucideIcon } from 'lucide-react';

export enum ModuleId {
  INTRO = 'intro',
  PHYSICS = 'physics', // Data Types
  PARTS = 'parts',     // Components
  WORKSHOP_3D = 'workshop_3d', // NEW: 3D Builder
  DECODER = 'decoder'   // JSON handling
}

export interface NavItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export enum ConnectionColor {
  MODEL = 'bg-purple-600',
  CLIP = 'bg-yellow-500',
  VAE = 'bg-red-500',
  CONDITIONING = 'bg-orange-500',
  LATENT = 'bg-pink-500',
  IMAGE = 'bg-blue-500',
  MASK = 'bg-gray-400'
}

export const ColorHex = {
  MODEL: '#9333ea', // Purple
  CLIP: '#eab308',  // Yellow
  VAE: '#ef4444',   // Red
  CONDITIONING: '#f97316', // Orange
  LATENT: '#ec4899', // Pink
  IMAGE: '#3b82f6', // Blue
  MASK: '#9ca3af',   // Gray
  CHASSIS: '#334155' // Slate
};

export interface DataTypeInfo {
  name: string;
  colorClass: string;
  description: string;
  analogy: string;
}

export interface ComfyNode {
  type: string;
  category: 'loader' | 'conditioning' | 'latent' | 'sampling' | 'image' | 'utils';
  inputs: { name: string; type: string }[];
  outputs: { name: string; type: string }[];
  description: string;
}

export interface RobotPart {
  nodeType: string;
  partName: string; // e.g., "Torso", "Head"
  description: string;
  color: string;
  position: [number, number, number]; // 3D position
}

// Minimal JSON structure for ComfyUI
export interface ComfyUIJSON {
  last_node_id?: number;
  last_link_id?: number;
  nodes: Array<{
    id: number;
    type: string;
    pos: [number, number];
    size?: [number, number];
    inputs?: Array<{ name: string; type: string; link: number | null }>;
    outputs?: Array<{ name: string; type: string; links: number[] | null }>;
  }>;
  links: Array<[number, number, number, number, number, string]>; 
  // [LinkID, SourceNodeID, SourceSlot, TargetNodeID, TargetSlot, Type]
}