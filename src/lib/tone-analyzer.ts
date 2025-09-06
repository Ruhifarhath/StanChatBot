export interface ToneAnalysis {
  primary: string;
  secondary?: string;
  energy: 'low' | 'medium' | 'high';
  formality: 'casual' | 'neutral' | 'formal';
  emotion: string;
  confidence: number;
}

class ToneAnalyzer {
  analyzeTone(text: string): ToneAnalysis {
    const lowerText = text.toLowerCase();
    
    // Emotion detection
    const emotion = this.detectEmotion(lowerText);
    
    // Energy level detection
    const energy = this.detectEnergy(text);
    
    // Formality detection
    const formality = this.detectFormality(lowerText);
    
    // Primary tone detection
    const primary = this.detectPrimaryTone(lowerText, emotion);
    
    return {
      primary,
      secondary: this.detectSecondaryTone(lowerText),
      energy,
      formality,
      emotion,
      confidence: 0.8 // Simplified confidence score
    };
  }

  private detectEmotion(text: string): string {
    const emotionPatterns = {
      joy: ['happy', 'excited', 'amazing', 'awesome', 'great', 'wonderful', 'fantastic', 'love', 'perfect'],
      sadness: ['sad', 'depressed', 'down', 'terrible', 'awful', 'horrible', 'devastated', 'miserable'],
      anger: ['angry', 'frustrated', 'mad', 'furious', 'annoyed', 'irritated', 'pissed', 'hate'],
      fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'terrified', 'frightened'],
      surprise: ['wow', 'omg', 'amazing', 'incredible', 'unbelievable', 'shocking'],
      disgust: ['gross', 'disgusting', 'awful', 'terrible', 'horrible', 'nasty']
    };

    for (const [emotion, words] of Object.entries(emotionPatterns)) {
      if (words.some(word => text.includes(word))) {
        return emotion;
      }
    }
    
    return 'neutral';
  }

  private detectEnergy(text: string): 'low' | 'medium' | 'high' {
    const exclamationCount = (text.match(/!/g) || []).length;
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const energeticWords = ['excited', 'amazing', 'awesome', 'incredible', 'fantastic'];
    
    const energyScore = exclamationCount * 2 + 
                       (capsCount / text.length) * 10 + 
                       energeticWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (energyScore > 3) return 'high';
    if (energyScore > 1) return 'medium';
    return 'low';
  }

  private detectFormality(text: string): 'casual' | 'neutral' | 'formal' {
    const casualWords = ['yeah', 'yup', 'nah', 'gonna', 'wanna', 'gotta', 'hey', 'sup', 'lol', 'haha'];
    const formalWords = ['however', 'furthermore', 'consequently', 'nevertheless', 'regarding', 'concerning'];
    
    const casualCount = casualWords.filter(word => text.includes(word)).length;
    const formalCount = formalWords.filter(word => text.includes(word)).length;
    
    if (casualCount > formalCount && casualCount > 0) return 'casual';
    if (formalCount > casualCount && formalCount > 0) return 'formal';
    return 'neutral';
  }

  private detectPrimaryTone(text: string, emotion: string): string {
    if (emotion !== 'neutral') return emotion;
    
    const tonePatterns = {
      supportive: ['support', 'help', 'there for you', 'understand', 'care'],
      inquisitive: ['?', 'how', 'what', 'why', 'when', 'where', 'tell me', 'curious'],
      contemplative: ['think', 'wonder', 'reflect', 'consider', 'ponder', 'philosophy'],
      playful: ['haha', 'lol', 'funny', 'joke', 'silly', 'fun', 'play'],
      serious: ['important', 'serious', 'concerned', 'matter', 'issue']
    };

    for (const [tone, words] of Object.entries(tonePatterns)) {
      if (words.some(word => text.includes(word))) {
        return tone;
      }
    }
    
    return 'neutral';
  }

  private detectSecondaryTone(text: string): string | undefined {
    // Simple implementation - could be more sophisticated
    if (text.includes('?') && text.includes('!')) return 'excited-curious';
    if (text.includes('...')) return 'thoughtful';
    return undefined;
  }

  generateResponseTone(userTone: ToneAnalysis): string {
    // Generate appropriate response tone based on user's tone
    switch (userTone.emotion) {
      case 'joy':
        return 'Share their enthusiasm while maintaining warmth';
      case 'sadness':
        return 'Offer gentle support and understanding';
      case 'anger':
        return 'Stay calm and empathetic, help them process feelings';
      case 'fear':
        return 'Provide reassurance and comfort';
      case 'surprise':
        return 'Match their surprise with appropriate excitement';
      default:
        return `Match their ${userTone.energy} energy with ${userTone.formality} tone`;
    }
  }
}

export const toneAnalyzer = new ToneAnalyzer();