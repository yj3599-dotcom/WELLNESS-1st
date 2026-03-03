import { MessageCircle } from 'lucide-react';
import { Card } from './ui/card';

interface FeedbackCardProps {
  feedback: string;
  timestamp: Date;
  name?: string;
}

export function FeedbackCard({ feedback, timestamp, name }: FeedbackCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="p-4 bg-white border-emerald-100 hover:border-emerald-200 transition-colors">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600">
              {name || 'Anonymous Student'}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
        </div>
      </div>
    </Card>
  );
}