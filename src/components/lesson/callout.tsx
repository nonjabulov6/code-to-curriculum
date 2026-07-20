import { cn } from "@/lib/utils";
import { Info, Lightbulb, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warning" | "success" | "error";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
};

const styles = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-200",
  tip: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200",
  warning: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/20 dark:border-orange-900/50 dark:text-orange-200",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-200",
  error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-200",
};

const iconColors = {
  info: "text-blue-600 dark:text-blue-400",
  tip: "text-amber-600 dark:text-amber-400",
  warning: "text-orange-600 dark:text-orange-400",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-red-600 dark:text-red-400",
};

export function Callout({ type = "info", title, children, className }: CalloutProps) {
  const Icon = icons[type];

  return (
    <div className={cn("my-6 flex gap-4 rounded-xl border p-5 shadow-sm", styles[type], className)}>
      <div className={cn("mt-0.5 shrink-0", iconColors[type])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        {title && <div className="font-display font-bold leading-tight">{title}</div>}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
