import { Message } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 mb-6 message-slide-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "w-10 h-10 shrink-0",
        isUser ? "bg-gradient-message" : "bg-gradient-ai"
      )}>
        <AvatarFallback className={cn(
          "text-sm font-medium",
          isUser ? "text-message-user-foreground" : "text-message-ai-foreground"
        )}>
          {isUser ? "Y" : "A"}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[75%] px-4 py-3 rounded-2xl shadow-message transition-smooth",
        isUser 
          ? "bg-gradient-message text-message-user-foreground rounded-br-md" 
          : "bg-gradient-ai text-message-ai-foreground rounded-bl-md",
        isLatest && !isUser && "glow-effect"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {message.metadata?.emotion && (
            <span className="text-xs opacity-70 capitalize">
              {message.metadata.emotion}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};