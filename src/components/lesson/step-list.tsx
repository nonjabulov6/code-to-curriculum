import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StepItem {
  title: string;
  content: ReactNode;
}

interface StepListProps {
  steps: StepItem[];
  className?: string;
}

export function StepList({ steps, className }: StepListProps) {
  return (
    <div className={cn("my-10 space-y-8", className)}>
      {steps.map((step, index) => (
        <div key={index} className="group relative flex gap-6">
          {/* Connector line */}
          {index !== steps.length - 1 && (
            <div className="absolute left-[1.125rem] top-10 h-[calc(100%+2rem)] w-0.5 bg-border group-hover:bg-primary/30 transition-colors" />
          )}
          
          {/* Step number circle */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-display text-sm font-bold text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {index + 1}
          </div>
          
          <div className="space-y-2 pb-2">
            <h4 className="font-display text-lg font-bold leading-tight">{step.title}</h4>
            <div className="text-sm leading-relaxed text-muted-foreground">{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
