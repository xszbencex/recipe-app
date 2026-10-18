import { Timestamp } from 'firebase/firestore';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  createdAt?: Timestamp;
}
