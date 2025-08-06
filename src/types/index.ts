// Core data types for the narrative pipeline app

export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
  role: string;
  avatar?: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  theme: string;
  characters: string[]; // character IDs
  conflict: string;
  learningOutcome: string;
  cliffhanger: string;
  script?: string; // generated script content
  status: 'draft' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  episodes: Episode[];
  rawContent: RawContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RawContent {
  id: string;
  name: string;
  type: 'pdf' | 'script' | 'video' | 'other';
  content: string;
  uploadedAt: Date;
}

export type EpisodeStatus = 'draft' | 'completed';
export type ExportFormat = 'markdown' | 'pdf';