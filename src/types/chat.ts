export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    mood?: string;
    emotion?: string;
    context?: string[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: Record<string, any>;
  conversationHistory: ConversationSummary[];
  personality: {
    interests: string[];
    communicationStyle: string;
    currentMood: string;
  };
  memories: Memory[];
}

export interface Memory {
  id: string;
  content: string;
  importance: number; // 1-10
  category: string;
  timestamp: Date;
  associatedContext: string[];
}

export interface ConversationSummary {
  id: string;
  date: Date;
  summary: string;
  topics: string[];
  mood: string;
  keyMemories: string[];
}

export interface AIPersonality {
  name: string;
  backstory: string;
  personality: string[];
  communicationStyle: string;
  interests: string[];
  quirks: string[];
  emotionalTraits: string[];
}