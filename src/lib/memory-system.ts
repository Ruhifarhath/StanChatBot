import { UserProfile, Memory, ConversationSummary, Message } from '../types/chat';

class MemorySystem {
  private storageKey = 'aria-user-profiles';
  
  getUserProfile(userId: string): UserProfile | null {
    try {
      const profiles = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      const profile = profiles[userId];
      if (profile) {
        // Convert date strings back to Date objects
        profile.conversationHistory = profile.conversationHistory?.map((conv: any) => ({
          ...conv,
          date: new Date(conv.date)
        })) || [];
        profile.memories = profile.memories?.map((memory: any) => ({
          ...memory,
          timestamp: new Date(memory.timestamp)
        })) || [];
      }
      return profile || null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    try {
      const profiles = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      profiles[profile.id] = profile;
      localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  createNewProfile(userId: string, name: string = 'Friend'): UserProfile {
    const profile: UserProfile = {
      id: userId,
      name,
      preferences: {},
      conversationHistory: [],
      personality: {
        interests: [],
        communicationStyle: 'friendly',
        currentMood: 'neutral'
      },
      memories: []
    };
    this.saveUserProfile(profile);
    return profile;
  }

  addMemory(userId: string, content: string, importance: number = 5, category: string = 'general'): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    const memory: Memory = {
      id: Date.now().toString(),
      content,
      importance,
      category,
      timestamp: new Date(),
      associatedContext: []
    };

    profile.memories.push(memory);
    
    // Keep only the most important memories (max 50)
    profile.memories.sort((a, b) => b.importance - a.importance);
    if (profile.memories.length > 50) {
      profile.memories = profile.memories.slice(0, 50);
    }

    this.saveUserProfile(profile);
  }

  updatePersonality(userId: string, updates: Partial<UserProfile['personality']>): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    profile.personality = { ...profile.personality, ...updates };
    this.saveUserProfile(profile);
  }

  addConversationSummary(userId: string, messages: Message[]): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    if (messages.length < 3) return; // Don't summarize very short conversations

    const topics = this.extractTopics(messages);
    const mood = this.analyzeMood(messages);
    const keyMemories = this.extractKeyMemories(messages);

    const summary: ConversationSummary = {
      id: Date.now().toString(),
      date: new Date(),
      summary: this.generateSummary(messages),
      topics,
      mood,
      keyMemories
    };

    profile.conversationHistory.push(summary);
    
    // Keep only last 20 conversation summaries
    if (profile.conversationHistory.length > 20) {
      profile.conversationHistory = profile.conversationHistory.slice(-20);
    }

    this.saveUserProfile(profile);
  }

  getRelevantMemories(userId: string, currentMessage: string): Memory[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    return profile.memories
      .filter(memory => this.isMemoryRelevant(memory, currentMessage))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5); // Return top 5 relevant memories
  }

  getConversationContext(userId: string): string[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    const recentConversations = profile.conversationHistory.slice(-3);
    return recentConversations.map(conv => conv.summary);
  }

  private extractTopics(messages: Message[]): string[] {
    // Simple keyword extraction - in production, use more sophisticated NLP
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const commonTopics = [
      'work', 'family', 'friends', 'hobbies', 'music', 'movies', 'books',
      'travel', 'food', 'sports', 'technology', 'art', 'philosophy',
      'relationships', 'career', 'education', 'health', 'fitness'
    ];
    
    return commonTopics.filter(topic => text.includes(topic));
  }

  private analyzeMood(messages: Message[]): string {
    // Simple sentiment analysis - in production, use ML models
    const userMessages = messages.filter(m => m.role === 'user');
    const text = userMessages.map(m => m.content).join(' ').toLowerCase();
    
    const positiveWords = ['happy', 'great', 'awesome', 'excited', 'good', 'amazing', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'angry', 'frustrated', 'upset', 'awful'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractKeyMemories(messages: Message[]): string[] {
    // Extract personal information shared by the user
    const userMessages = messages.filter(m => m.role === 'user');
    return userMessages
      .filter(m => this.containsPersonalInfo(m.content))
      .map(m => m.content)
      .slice(0, 3);
  }

  private containsPersonalInfo(text: string): boolean {
    const personalIndicators = [
      'my name is', 'i am', 'i work', 'i live', 'i like', 'i love',
      'i hate', 'my favorite', 'i have', 'i do', 'i study', 'i went to'
    ];
    const lowerText = text.toLowerCase();
    return personalIndicators.some(indicator => lowerText.includes(indicator));
  }

  private generateSummary(messages: Message[]): string {
    // Simple summarization - in production, use AI summarization
    const topics = this.extractTopics(messages);
    const mood = this.analyzeMood(messages);
    return `Conversation about ${topics.slice(0, 3).join(', ') || 'general topics'} with ${mood} mood`;
  }

  private isMemoryRelevant(memory: Memory, currentMessage: string): boolean {
    // Simple relevance check - in production, use semantic similarity
    const memoryWords = memory.content.toLowerCase().split(' ');
    const messageWords = currentMessage.toLowerCase().split(' ');
    const overlap = memoryWords.filter(word => messageWords.includes(word));
    return overlap.length > 0 || memory.importance > 7;
  }
}

export const memorySystem = new MemorySystem();
