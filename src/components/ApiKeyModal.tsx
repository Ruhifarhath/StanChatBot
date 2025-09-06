import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal = ({ open, onClose, onSubmit }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
      setApiKey('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Google Gemini API Key Required
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>To use Aria's advanced AI capabilities, you'll need a Google Gemini API key.</p>
            <p className="text-sm">
              Don't have one? 
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-1 text-primary hover:underline"
              >
                Get your free API key here
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apikey">API Key</Label>
            <Input
              id="apikey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Use Demo Mode
            </Button>
            <Button 
              type="submit" 
              disabled={!apiKey.trim()}
              className="flex-1 bg-gradient-primary"
            >
              Connect
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally and never shared. Demo mode uses smart fallback responses.
        </p>
      </DialogContent>
    </Dialog>
  );
};