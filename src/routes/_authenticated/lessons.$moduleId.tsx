import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, CheckCircle2, Circle, Code, PlayCircle, Target, BookOpen, Dumbbell, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/lessons/$moduleId")({
  head: () => ({ meta: [{ title: "Lessons — LearnHub Tech" }] }),
  component: LessonsPage,
});

function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  } catch {
    return url;
  }
}

function LessonsPage() {
  const { moduleId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["module-lessons", moduleId, user?.id],
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
      qc.invalidateQueries({ queryKey: ["module-lessons", moduleId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e.message),
  });

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!q.data?.module) return <PageShell><div className="p-20 text-center">Module not found.</div></PageShell>;

  const { module, lessons, viewedIds } = q.data;
  const active = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const viewedCount = lessons.filter((l) => viewedIds.has(l.id)).length;
  const allViewed = lessons.length > 0 && viewedCount === lessons.length;
  const percent = lessons.length ? Math.round((viewedCount / lessons.length) * 100) : 0;
  const embedUrl = toEmbedUrl(active?.video_url);

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
          <h1 className="mt-4 font-display text-4xl font-bold">{module.title}</h1>
          {module.description && <p className="mt-2 text-muted-foreground">{module.description}</p>}

          {module.overview && (
            <Card className="mt-6 p-6 shadow-card">
              <div className="flex items-center gap-2 text-primary"><BookOpen className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Module overview</span></div>
              <p className="mt-2 leading-relaxed text-foreground/90">{module.overview}</p>
            </Card>
          )}

          {module.objectives && module.objectives.length > 0 && (
            <Card className="mt-4 p-6 shadow-card">
              <div className="flex items-center gap-2 text-primary"><Target className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Learning objectives</span></div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {module.objectives.map((o: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{o}</span></li>
                ))}
              </ul>
            </Card>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Progress value={percent} className="h-2 flex-1" />
            <span className="text-sm text-muted-foreground">{viewedCount} / {lessons.length} lessons viewed</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Lesson list */}
          <aside className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lessons</div>
            {lessons.map((l, i) => {
              const isViewed = viewedIds.has(l.id);
              const isActive = l.id === active?.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonId(l.id)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/50"}`}
                >
                  {isViewed ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-primary">Lesson {i + 1}</div>
                    <div className="truncate text-sm font-medium">{l.title}</div>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Active lesson */}
          <div className="space-y-6">
            {!active && <Card className="p-8 text-center text-muted-foreground">No lessons yet.</Card>}
            {active && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">Lesson {lessons.findIndex((l) => l.id === active.id) + 1} of {lessons.length}</div>
                    <h2 className="mt-1 font-display text-2xl font-bold">{active.title}</h2>
                  </div>
                  {viewedIds.has(active.id) && <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" />Viewed</Badge>}
                </div>

                {embedUrl && (
                  <div className="mt-5 overflow-hidden rounded-lg border border-border">
                    <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2 text-xs text-secondary-foreground/80">
                      <PlayCircle className="h-3.5 w-3.5" /> Video tutorial
                    </div>
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={embedUrl}
                        title={`${active.title} tutorial`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </div>
                )}

                {active.content && <p className="mt-5 leading-relaxed text-foreground/90 whitespace-pre-line">{active.content}</p>}

                {active.code_example && (
                  <div className="mt-5 overflow-hidden rounded-lg border border-border bg-secondary">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-secondary-foreground/70">
                      <Code className="h-3.5 w-3.5" /> Code example
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm text-secondary-foreground"><code>{active.code_example}</code></pre>
                  </div>
                )}

                {active.exercise && (
                  <div className="mt-5 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                    <div className="flex items-center gap-2 text-primary"><Dumbbell className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Practice exercise</span></div>
                    <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">{active.exercise}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
                  <Button
                    variant={viewedIds.has(active.id) ? "secondary" : "default"}
                    onClick={() => markViewed.mutate(active.id)}
                    disabled={markViewed.isPending || viewedIds.has(active.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {viewedIds.has(active.id) ? "Lesson viewed" : "Mark lesson as viewed"}
                  </Button>
                  {(() => {
                    const idx = lessons.findIndex((l) => l.id === active.id);
                    const next = lessons[idx + 1];
                    return next ? (
                      <Button variant="outline" onClick={() => { if (!viewedIds.has(active.id)) markViewed.mutate(active.id); setActiveLessonId(next.id); }}>
                        Next lesson: {next.title} →
                      </Button>
                    ) : null;
                  })()}
                </div>
              </Card>
            )}

            {/* Quiz gate */}
            <Card className={`p-6 shadow-card ${allViewed ? "border-primary/40" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">Ready to test your knowledge?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {allViewed
                      ? "You've viewed every lesson. Take the module quiz to complete this module."
                      : `View all ${lessons.length} lessons to unlock the quiz (${viewedCount} / ${lessons.length} viewed).`}
                  </p>
                </div>
                {allViewed ? (
                  <Button asChild size="lg"><Link to="/quiz/$moduleId" params={{ moduleId }}>Take Quiz →</Link></Button>
                ) : (
                  <Button size="lg" disabled><Lock className="mr-2 h-4 w-4" />Quiz locked</Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
