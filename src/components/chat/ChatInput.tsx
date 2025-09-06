import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3 p-4 bg-card/50 backdrop-blur-sm border border-border rounded-2xl">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 opacity-60 hover:opacity-100 transition-smooth"
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[44px] max-h-32 resize-none border-0 bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-muted-foreground"
          )}
          rows={1}
        />
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="sm"
          className={cn(
            "shrink-0 bg-gradient-primary hover:opacity-90 transition-smooth",
            "disabled:opacity-30"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};