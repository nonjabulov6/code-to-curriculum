import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, CheckCircle2, Code } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/lessons/$moduleId")({
  head: () => ({ meta: [{ title: "Lessons — LearnHub Tech" }] }),
  component: LessonsPage,
});

function LessonsPage() {
  const { moduleId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["module-lessons", moduleId, user?.id],
    queryFn: async () => {
      const { data: mod } = await supabase.from("modules").select("*").eq("id", moduleId).maybeSingle();
      const { data: lessons } = await supabase.from("lessons").select("*").eq("module_id", moduleId).order("position");
      const { data: progress } = await supabase.from("module_progress").select("*").eq("user_id", user!.id).eq("module_id", moduleId).maybeSingle();
      return { module: mod, lessons: lessons ?? [], progress };
    },
    enabled: !!user,
  });

  const markComplete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("module_progress").upsert({
        user_id: user!.id, module_id: moduleId, completed: true, completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Module marked complete!"); qc.invalidateQueries({ queryKey: ["module-lessons"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); },
    onError: (e) => toast.error(e.message),
  });

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (!q.data?.module) return <PageShell><div className="p-20 text-center">Module not found.</div></PageShell>;

  const { module, lessons, progress } = q.data;
  const completed = progress?.completed;

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
          <h1 className="mt-4 font-display text-4xl font-bold">{module.title}</h1>
          <p className="mt-2 text-muted-foreground">{module.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        {lessons.length === 0 && <Card className="p-8 text-center text-muted-foreground">No lessons yet.</Card>}
        {lessons.map((l, i) => (
          <Card key={l.id} className="p-6 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Lesson {i + 1}</div>
            <h2 className="mt-1 font-display text-2xl font-bold">{l.title}</h2>
            <p className="mt-3 leading-relaxed text-foreground/90">{l.content}</p>

            {l.code_example && (
              <div className="mt-5 overflow-hidden rounded-lg border border-border bg-secondary">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-secondary-foreground/70">
                  <Code className="h-3.5 w-3.5" /> code example
                </div>
                <pre className="overflow-x-auto p-4 text-sm text-secondary-foreground"><code>{l.code_example}</code></pre>
              </div>
            )}

            {l.exercise && (
              <div className="mt-5 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Practice</div>
                <p className="mt-1 text-sm text-foreground/90">{l.exercise}</p>
              </div>
            )}
          </Card>
        ))}

        <div className="flex flex-wrap justify-between gap-3 pt-4">
          <Button variant="outline" onClick={() => markComplete.mutate()} disabled={markComplete.isPending || completed}>
            <CheckCircle2 className="mr-2 h-4 w-4" />{completed ? "Completed" : "Mark module complete"}
          </Button>
          <Button asChild><Link to="/quiz/$moduleId" params={{ moduleId }}>Take the quiz →</Link></Button>
        </div>
      </section>
    </PageShell>
  );
}
