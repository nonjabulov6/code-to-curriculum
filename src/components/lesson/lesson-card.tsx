import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface LessonCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "subtle";
}

export function LessonCard({ title, children, className, variant = "default" }: LessonCardProps) {
  return (
    <Card
      className={cn(
        "my-8 overflow-hidden transition-all duration-200",
        variant === "default" && "border-border bg-card shadow-card hover:shadow-elegant",
        variant === "outline" && "border-2 border-primary/10 bg-transparent shadow-none",
        variant === "subtle" && "border-none bg-accent/30 shadow-none",
        className
      )}
    >
      {title && (
        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
          <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
      </div>
    </Card>
  );
}
