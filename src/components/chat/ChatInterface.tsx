import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, Settings, Brain } from 'lucide-react';
import { memorySystem } from '@/lib/memory-system';
import { toneAnalyzer } from '@/lib/tone-analyzer';
import { generateSystemPrompt } from '@/lib/ai-personality';

interface ChatInterfaceProps {
  onSendMessage: (message: string, context: any) => Promise<string>;
}

export const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState('demo-user-001');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user profile and welcome message
  useEffect(() => {
    let profile = memorySystem.getUserProfile(userId);
    if (!profile) {
      profile = memorySystem.createNewProfile(userId, 'Friend');
    }

    // Add welcome message if no conversation history
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hey there! I'm Aria 😊 I'm really excited to chat with you. I love getting to know people and having meaningful conversations about whatever's on your mind.\n\nWhat's going on with you today? I'd love to hear about what you're thinking about or anything that's caught your interest lately.`,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          emotion: 'joy',
          mood: 'welcoming'
        }
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Analyze user's tone and update personality insights
      const toneAnalysis = toneAnalyzer.analyzeTone(content);
      
      // Get user profile and context
      const profile = memorySystem.getUserProfile(userId);
      const relevantMemories = memorySystem.getRelevantMemories(userId, content);
      const conversationContext = memorySystem.getConversationContext(userId);
      
      // Update user's current mood based on tone
      if (profile) {
        memorySystem.updatePersonality(userId, { 
          currentMood: toneAnalysis.emotion 
        });
      }

      // Add important information to memory
      if (content.length > 50 && toneAnalysis.primary !== 'neutral') {
        memorySystem.addMemory(userId, content, toneAnalysis.confidence * 10, toneAnalysis.primary);
      }

      // Prepare context for AI
      const context = {
        userProfile: profile,
        relevantMemories,
        conversationContext,
        toneAnalysis,
        recentMessages: messages.slice(-5),
        responseGuidance: toneAnalyzer.generateResponseTone(toneAnalysis)
      };

      // Get AI response
      const response = await onSendMessage(content, context);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          emotion: toneAnalysis.emotion,
          context: relevantMemories.map(m => m.content)
        }
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add conversation summary if we have enough messages
      const allMessages = [...messages, userMessage, aiMessage];
      if (allMessages.length % 10 === 0) {
        memorySystem.addConversationSummary(userId, allMessages.slice(-10));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Could you try again in a moment?",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-gradient-ai">
              <AvatarFallback className="text-message-ai-foreground font-medium">
                A
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-foreground">Aria</h1>
              <p className="text-sm text-muted-foreground">
                Your empathetic AI companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
              <Brain className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 p-4 custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 bg-card/20 backdrop-blur-sm border-t border-border">
          <div className="max-w-4xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              placeholder="Share what's on your mind..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};