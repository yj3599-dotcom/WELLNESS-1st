import { useState } from 'react';
import { Send, UserCircle, UserX } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface FeedbackFormProps {
  onSubmit: (feedback: string, name?: string, secretMessage?: string) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    onSubmit(
      feedback, 
      isAnonymous ? undefined : name.trim() || undefined,
      secretMessage.trim() || undefined
    );
    setFeedback('');
    setSecretMessage('');
    setName('');
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm text-emerald-900">
          In your opinion, what is the pressing wellness challenge (related to health, happiness, or community) currently facing the 3rd Cohort? What solutions do you envision? (Ideas don't need to be fully formed—rough thoughts are welcome!)
        </label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts here..."
          className="min-h-[120px] resize-none border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="secret" className="text-sm text-emerald-900">
          Additional Private Message (Optional - Only visible to admin)
        </label>
        <p className="text-xs text-emerald-600 mb-1">
          All submissions here are strictly confidential.
        </p>
        <Textarea
          id="secret"
          value={secretMessage}
          onChange={(e) => setSecretMessage(e.target.value)}
          placeholder="Anything else you'd like to share privately with the wellness team..."
          className="min-h-[80px] resize-none border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-emerald-50/30"
          disabled={isSubmitting}
        />
      </div>

      {!isAnonymous && (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-emerald-900">
            Your Name (Optional)
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAnonymous(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isAnonymous
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            disabled={isSubmitting}
          >
            <UserX className="w-4 h-4" />
            Anonymous
          </button>
          <button
            type="button"
            onClick={() => setIsAnonymous(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              !isAnonymous
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            disabled={isSubmitting}
          >
            <UserCircle className="w-4 h-4" />
            Show Name
          </button>
        </div>

        <Button
          type="submit"
          disabled={!feedback.trim() || isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}