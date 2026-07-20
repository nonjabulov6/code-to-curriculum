import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  BookOpen, 
  Clock, 
  BarChart,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/lesson/callout";
import { LessonCard } from "@/components/lesson/lesson-card";
import { StepList } from "@/components/lesson/step-list";
import { ContentRenderer } from "@/components/lesson/content-renderer";

export const Route = createFileRoute("/_authenticated/lessons-v2/$moduleId")({
  head: () => ({ meta: [{ title: "Lesson Redesign — LearnHub Tech" }] }),
  component: LessonV2Page,
});

function LessonV2Page() {
  const { moduleId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const q = useQuery({
    queryKey: ["module-lessons-v2", moduleId, user?.id],
    queryFn: async () => {
      const { data: mod } = await supabase.from("modules").select("*").eq("id", moduleId).maybeSingle();
      const { data: lessons } = await supabase.from("lessons").select("*").eq("module_id", moduleId).order("position");
      const { data: viewed } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("module_id", moduleId);
      const { data: progress } = await supabase.from("module_progress").select("*").eq("user_id", user!.id).eq("module_id", moduleId).maybeSingle();
      return {
        module: mod,
        lessons: lessons ?? [],
        viewedIds: new Set((viewed ?? []).map((v) => v.lesson_id as string)),
        progress,
      };
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!activeLessonId && q.data?.lessons.length) setActiveLessonId(q.data.lessons[0].id);
  }, [q.data?.lessons, activeLessonId]);

  const markViewed = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lesson_progress").upsert(
        { user_id: user!.id, lesson_id: lessonId, module_id: moduleId, viewed: true, viewed_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["module-lessons-v2", moduleId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e.message),
  });

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!q.data?.module) return <PageShell><div className="p-20 text-center">Module not found.</div></PageShell>;

  const { module, lessons, viewedIds } = q.data;
  const activeIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const active = lessons[activeIndex] ?? lessons[0];
  const viewedCount = lessons.filter((l) => viewedIds.has(l.id)).length;
  const percent = lessons.length ? Math.round((viewedCount / lessons.length) * 100) : 0;

  const prevLesson = lessons[activeIndex - 1];
  const nextLesson = lessons[activeIndex + 1];

  return (
    <PageShell>
      <div className="flex min-h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar Navigation */}
        <aside 
          className={cn(
            "fixed inset-y-16 left-0 z-20 w-80 border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full lg:hidden"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" /> Back to Dashboard
              </Link>
              <h2 className="mt-4 font-display text-xl font-bold">{module.title}</h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Module Progress</span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {lessons.map((l, i) => {
                const isViewed = viewedIds.has(l.id);
                const isActive = l.id === active?.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveLessonId(l.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-accent/50 text-foreground/80"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      isActive ? "border-primary-foreground/30" : "border-muted-foreground/30"
                    )}>
                      {isViewed ? (
                        <CheckCircle2 className={cn("h-3.5 w-3.5", isActive ? "text-primary-foreground" : "text-primary")} />
                      ) : (
                        <span className="text-[10px] font-bold">{i + 1}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={cn("truncate text-sm font-semibold", isActive ? "text-primary-foreground" : "text-foreground")}>
                        {l.title}
                      </div>
                      <div className={cn("text-[10px] uppercase tracking-wider opacity-70", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        Lesson {i + 1}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <nav className="hidden text-xs font-medium text-muted-foreground sm:flex items-center gap-2">
                <Link to="/dashboard" className="hover:text-foreground">Courses</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="max-w-[150px] truncate">{module.title}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-semibold">{active?.title}</span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!prevLesson}
                onClick={() => setActiveLessonId(prevLesson.id)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!nextLesson}
                onClick={() => {
                  if (!viewedIds.has(active.id)) markViewed.mutate(active.id);
                  setActiveLessonId(nextLesson.id);
                }}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
            {/* Lesson Header */}
            <div className="mb-10 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded"><Clock className="h-3.5 w-3.5" /> 10 min</span>
                <span className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded"><BarChart className="h-3.5 w-3.5" /> Beginner</span>
                {viewedIds.has(active?.id) && (
                  <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
                {active?.title}
              </h1>
            </div>

            {/* Placeholder for Learning Objectives (from Module) */}
            {activeIndex === 0 && module.objectives && (
              <Callout type="info" title="What you'll learn in this module">
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {module.objectives.map((o: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Callout>
            )}

            {/* Lesson Content Area */}
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {/* If it's the first lesson, show a demo of structured content */}
              {activeIndex === 0 ? (
                <ContentRenderer content={[
                  { type: "text", content: "Welcome to the new lesson experience! This lesson demonstrates how we use structured blocks to create engaging, text-based learning without relying on video." },
                  { type: "heading", level: 2, content: "Core Philosophy" },
                  { type: "text", content: "We believe that active learning is superior to passive consumption. By breaking information into small, digestible chunks, we help you retain more knowledge in less time." },
                  { type: "callout", calloutType: "tip", title: "Learning Tip", content: "Try to explain what you've learned to someone else. This 'Feynman Technique' is one of the most effective ways to solidify new concepts." },
                  { type: "heading", level: 3, content: "How it works" },
                  { type: "steps", steps: [
                    { title: "Read & Absorb", content: "Go through the text-based sections at your own pace." },
                    { title: "Interact", content: "Engage with the callouts, cards, and interactive exercises." },
                    { title: "Verify", content: "Check your understanding with quick knowledge checks throughout the page." }
                  ]},
                  { type: "card", title: "Key Takeaway", content: "Consistency is more important than intensity. Spending 10 minutes every day is better than 5 hours once a week.", variant: "default" },
                  { type: "code", language: "javascript", title: "Example Logic", code: "function learn(concept) {\n  const active = true;\n  if (active) {\n    return 'Knowledge Retained';\n  }\n  return 'Forgotten';\n}" }
                ]} />
              ) : (
                <div className="space-y-8">
                  <ContentRenderer content={active?.content || ""} />

                  {active?.code_example && (
                    <LessonCard title="Code Example">
                      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-50 font-mono">
                        <code>{active.code_example}</code>
                      </pre>
                    </LessonCard>
                  )}

                  {active?.exercise && (
                    <Callout type="tip" title="Practice Exercise">
                      {active.exercise}
                    </Callout>
                  )}
                </div>
              )}
            </article>

            {/* Bottom Navigation */}
            <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Finished with this lesson?</p>
                <Button 
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => markViewed.mutate(active.id)}
                  disabled={markViewed.isPending || viewedIds.has(active.id)}
                >
                  {viewedIds.has(active.id) ? "Lesson Completed" : "Mark as Finished"}
                </Button>
              </div>
              
              {nextLesson && (
                <Link 
                  to="/_authenticated/lessons-v2/$moduleId" 
                  params={{ moduleId }}
                  onClick={() => {
                    if (!viewedIds.has(active.id)) markViewed.mutate(active.id);
                    setActiveLessonId(nextLesson.id);
                  }}
                  className="group flex items-center gap-4 text-right"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Lesson</p>
                    <p className="font-display text-lg font-bold group-hover:text-primary transition-colors">{nextLesson.title}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
