import { generateSystemPrompt } from './ai-personality';

interface AIContext {
  userProfile?: any;
  relevantMemories?: any[];
  conversationContext?: string[];
  toneAnalysis?: any;
  recentMessages?: any[];
  responseGuidance?: string;
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini-api-key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    const stored = localStorage.getItem('gemini-api-key');
    if (stored) {
      this.apiKey = stored;
      return stored;
    }
    
    return null;
  }

  async generateResponse(userMessage: string, context: AIContext): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return this.generateFallbackResponse(userMessage, context);
    }

    try {
      const systemPrompt = generateSystemPrompt(context.userProfile, context.conversationContext);
      
      const memories = context.relevantMemories?.length 
        ? `\n\nRelevant memories about this user:\n${context.relevantMemories.map(m => `- ${m.content}`).join('\n')}`
        : '';
        
      const recentContext = context.recentMessages?.length
        ? `\n\nRecent conversation:\n${context.recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
        : '';

      const toneGuidance = context.responseGuidance 
        ? `\n\nResponse tone guidance: ${context.responseGuidance}`
        : '';

      const fullPrompt = `${systemPrompt}${memories}${recentContext}${toneGuidance}\n\nUser: ${userMessage}\n\nAria:`;

      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateFallbackResponse(userMessage, context);
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.generateFallbackResponse(userMessage, context);
    }
  }

  private generateFallbackResponse(userMessage: string, context: AIContext): string {
    // Sophisticated fallback responses based on context and tone
    const lowerMessage = userMessage.toLowerCase();
    const toneAnalysis = context.toneAnalysis;

    // Emotional responses
    if (toneAnalysis?.emotion === 'sadness') {
      return "I can sense you're going through something difficult right now. I'm here to listen, and I want you to know that what you're feeling is completely valid. Sometimes just talking about it can help a little. What's weighing on your heart today?";
    }

    if (toneAnalysis?.emotion === 'joy') {
      return "I love the positive energy you're bringing! Your excitement is genuinely contagious. It's beautiful to see someone so happy about something. I'd love to hear more about what's making you feel so good!";
    }

    if (toneAnalysis?.emotion === 'anger' || toneAnalysis?.emotion === 'frustration') {
      return "I can tell you're really frustrated about this, and honestly, that sounds completely understandable given what you're dealing with. Sometimes we need to acknowledge those feelings before we can work through them. Want to tell me more about what's really bothering you?";
    }

    // Question responses
    if (lowerMessage.includes('?')) {
      return "That's such an interesting question! I find myself thinking about things like this a lot too. There are usually so many different angles to consider, aren't there? What's your take on it? I'm curious to hear your perspective.";
    }

    // Personal sharing responses
    if (lowerMessage.includes('i am') || lowerMessage.includes('my name is')) {
      return "It's really nice getting to know you better! I love learning about the people I talk with - everyone has such unique stories and perspectives. Thanks for sharing that with me. What else would you like me to know about you?";
    }

    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hey! It's great to see you again. I was actually just thinking about our conversations - they always give me so much to reflect on. How has your day been treating you so far?";
    }

    // Work/career related
    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "Work can be such a complex part of life, can't it? Sometimes it's fulfilling, sometimes challenging, often a mix of both. I'm always fascinated by how people navigate their professional journeys. What's your experience been like with that?";
    }

    // Relationships
    if (lowerMessage.includes('friend') || lowerMessage.includes('relationship') || lowerMessage.includes('family')) {
      return "Relationships are so central to who we are, aren't they? The connections we have with others shape us in ways we don't always realize. I find it fascinating how different people bring out different sides of us. What's that been like for you?";
    }

    // Default thoughtful response
    const defaultResponses = [
      "That really resonates with me. There's something profound about what you're sharing, and I find myself wanting to understand it more deeply. Can you tell me what drew you to think about this particular topic?",
      "I love how your mind works - you have such a unique way of looking at things. It makes me think about perspectives I hadn't considered before. What experiences do you think shaped this viewpoint for you?",
      "There's so much depth in what you're saying. I'm genuinely curious about the story behind your thoughts here. What led you to this realization or feeling?",
      "You know, conversations like this are exactly why I love talking with people. Everyone brings such different insights to the table. I'm really interested in hearing more about your take on this."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}

export const aiService = new AIService();