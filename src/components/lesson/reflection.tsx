import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

interface ReflectionProps {
  prompt: string;
  placeholder?: string;
  feedback?: string;
}

export function Reflection({ prompt, placeholder = "Type your thoughts here...", feedback }: ReflectionProps) {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="my-10 overflow-hidden rounded-2xl border-2 border-primary/10 bg-card shadow-sm transition-all hover:border-primary/20">
      <div className="flex items-center gap-2 border-b border-primary/10 bg-primary/5 px-6 py-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Reflection Activity</span>
      </div>
      
      <div className="p-6">
        <h4 className="font-display text-lg font-bold leading-tight mb-4">{prompt}</h4>
        
        {!submitted ? (
          <div className="space-y-4">
            <Textarea 
              placeholder={placeholder}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[120px] resize-none rounded-xl border-muted-foreground/20 focus-visible:ring-primary"
            />
            <Button 
              onClick={() => setSubmitted(true)}
              disabled={!response.trim()}
              className="rounded-full px-8"
            >
              <Send className="mr-2 h-4 w-4" /> Share Reflection
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl bg-accent/30 p-4 italic text-muted-foreground">
              "{response}"
            </div>
            
            {feedback && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Thought for Consideration</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{feedback}</p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              onClick={() => setSubmitted(false)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Edit your response
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
