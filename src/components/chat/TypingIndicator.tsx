import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-6">
      <Avatar className="w-10 h-10 shrink-0 bg-gradient-ai">
        <AvatarFallback className="text-sm font-medium text-message-ai-foreground">
          A
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gradient-ai text-message-ai-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-typing">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-pulse"></div>
            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-xs opacity-70 ml-2">Aria is thinking...</span>
        </div>
      </div>
    </div>
  );
};