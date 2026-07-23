import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out will-change-transform", shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", className)}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
