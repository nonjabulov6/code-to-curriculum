import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, HelpCircle, RefreshCcw } from "lucide-react";

interface KnowledgeCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export function KnowledgeCheck({ question, options, correctIndex, explanation }: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === correctIndex;

  return (
    <div className="my-10 overflow-hidden rounded-2xl border-2 border-primary/10 bg-card shadow-sm transition-all hover:border-primary/20">
      <div className="flex items-center gap-2 border-b border-primary/10 bg-primary/5 px-6 py-3">
        <HelpCircle className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Knowledge Check</span>
      </div>
      
      <div className="p-6">
        <h4 className="font-display text-lg font-bold leading-tight mb-6">{question}</h4>
        
        <RadioGroup 
          className="space-y-3" 
          value={selected?.toString()} 
          onValueChange={(v) => !submitted && setSelected(Number(v))}
        >
          {options.map((option, i) => {
            const isSelected = selected === i;
            const showSuccess = submitted && i === correctIndex;
            const showError = submitted && isSelected && !isCorrect;

            return (
              <div 
                key={i} 
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 transition-all cursor-pointer",
                  !submitted && "hover:border-primary/40 hover:bg-accent/50",
                  showSuccess && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
                  showError && "border-red-500 bg-red-50 dark:bg-red-950/20",
                  isSelected && !submitted && "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem value={i.toString()} id={`q-${i}`} disabled={submitted} className="sr-only" />
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                  showSuccess ? "border-emerald-500 bg-emerald-500 text-white" :
                  showError ? "border-red-500 bg-red-500 text-white" :
                  isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                )}>
                  {submitted && i === correctIndex ? <CheckCircle2 className="h-3 w-3" /> : 
                   submitted && isSelected && !isCorrect ? <XCircle className="h-3 w-3" /> :
                   String.fromCharCode(65 + i)}
                </div>
                <Label htmlFor={`q-${i}`} className="flex-1 cursor-pointer font-medium">
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {!submitted ? (
            <Button 
              onClick={() => setSubmitted(true)} 
              disabled={selected === null}
              className="rounded-full px-8"
            >
              Check Answer
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-4">
              <div className={cn(
                "rounded-xl p-4 text-sm leading-relaxed",
                isCorrect ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200" : 
                           "bg-red-50 text-red-900 dark:bg-red-950/20 dark:text-red-200"
              )}>
                <div className="font-bold mb-1">
                  {isCorrect ? "Correct!" : "Not quite right."}
                </div>
                {explanation && <p className="opacity-90">{explanation}</p>}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSubmitted(false);
                  setSelected(null);
                }}
                className="self-start rounded-full"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
