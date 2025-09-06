import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { aiService } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Settings, Brain, Github, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = aiService.getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    aiService.setApiKey(apiKey);
    setHasApiKey(true);
  };

  const handleSendMessage = async (message: string, context: any): Promise<string> => {
    return await aiService.generateResponse(message, context);
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6 bg-card/50 backdrop-blur-sm border-border">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-ai rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-message-ai-foreground" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Meet Aria
              </h1>
              <p className="text-lg text-muted-foreground">
                Your empathetic AI companion with memory and personality
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✨ Human-like conversations with emotional intelligence</p>
              <p>🧠 Remembers your preferences and past conversations</p>
              <p>🎭 Adapts tone and personality to match your style</p>
              <p>💫 Built for the STAN AI Challenge with advanced features</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setShowApiModal(true)}
              className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Connect Gemini API
            </Button>
            
            <Button 
              onClick={() => setHasApiKey(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Try Demo Mode
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              STAN Internship Challenge - Conversational AI Track
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Github className="w-3 h-3 mr-1" />
                GitHub
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Live Demo
              </Button>
            </div>
          </div>
        </Card>

        <ApiKeyModal
          open={showApiModal}
          onClose={() => setShowApiModal(false)}
          onSubmit={handleApiKeySubmit}
        />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatInterface onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Index;
