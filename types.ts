export interface User {
  id: string;
  email: string;
  password?: string; // Should not be stored long-term in a real app
}

export enum Category {
  Pencils = 'Pencils',
  Trees = 'Trees',
}

export interface AnalysisResult {
  sharpness?: number; // for pencils
  size: number; // for pencils (length), for trees (height)
  fruitBearing?: number; // for trees
  greenLeafs?: number; // for trees
}

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  analysis?: AnalysisResult | null; // null means analysis in progress, undefined means not started
}

export interface ChatMessage {
  id:string;
  from: string; // user id
  to: string; // user id
  text?: string;
  timestamp: number;
  type: 'text' | 'audio';
  audioData?: string; // base64
  deletedFor?: string[]; // user IDs
  deletedForEveryone?: boolean;
}