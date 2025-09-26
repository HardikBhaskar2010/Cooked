// This file is now deprecated as we're using Firebase directly
// All API calls are handled through firebaseService.ts

import { firebaseService } from './firebaseService';

// Export Firebase service for backward compatibility
export const apiService = firebaseService;
export default firebaseService;

// Keep types for compatibility
export interface ComponentSpec {
  [key: string]: string;
}

export interface Component {
  id?: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  availability: string;
  specifications?: ComponentSpec;
  created_at?: string;
  updated_at?: string;
}

export interface ComponentCreate {
  name: string;
  description: string;
  category: string;
  price_range: string;
  specifications?: {[key: string]: string};
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: 'lt-2h' | '2-5h' | '5-10h' | '10h-plus';
  components: string[];
  category: string;
  instructions: string[];
  created_at?: string;
}

export interface GenerateProjectRequest {
  skill?: string;
  categories?: string[];
  components?: string[];
  time?: string;
  notes?: string;
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  status: 'saved' | 'in-progress' | 'completed';
  dateSaved: string;
  instructions: string;
  requirements: string[];
  notes?: string;
  user_id?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}