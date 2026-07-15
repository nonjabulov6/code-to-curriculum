import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, CheckCircle2, PlayCircle, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LearnHub Tech" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();

  const q = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: course } = await supabase.from("courses").select("*").eq("slug", "web-development-fundamentals").maybeSingle();
      if (!course) return null;
      const { data: modules } = await supabase.from("modules").select("*").eq("course_id", course.id).order("position");
      const { data: enrollment } = await supabase.from("enrollments").select("*").eq("user_id", user!.id).eq("course_id", course.id).maybeSingle();
      const { data: progress } = await supabase.from("module_progress").select("*").eq("user_id", user!.id);
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle();
      return { course, modules: modules ?? [], enrollment, progress: progress ?? [], profile };
    },
  });

  if (q.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading…</div></PageShell>;
  const data = q.data;
  if (!data) return <PageShell><div className="p-20 text-center">No course available.</div></PageShell>;

  const { course, modules, enrollment, progress, profile } = data;
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.module_id));
  const completedCount = completedIds.size;
  const total = modules.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const nextModule = modules.find((m) => !completedIds.has(m.id)) ?? modules[0];

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-sm text-muted-foreground">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</div>
          <h1 className="mt-1 font-display text-4xl font-bold">Your learning dashboard</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {!enrollment ? (
          <Card className="p-8 text-center shadow-card">
            <h2 className="font-display text-2xl font-bold">You're not enrolled yet</h2>
            <p className="mt-2 text-muted-foreground">Enroll in Web Development Fundamentals to get started.</p>
            <Button className="mt-6" asChild><Link to="/course">View course</Link></Button>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 shadow-card md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Enrolled course</div>
                    <h2 className="mt-1 font-display text-2xl font-bold">{course.title}</h2>
                  </div>
                  {nextModule && (
                    <Button asChild><Link to="/lessons/$moduleId" params={{ moduleId: nextModule.id }}><PlayCircle className="mr-2 h-4 w-4" />Continue</Link></Button>
                  )}
                </div>
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{completedCount} / {total} modules</span>
                  </div>
                  <Progress value={pct} />
                </div>
              </Card>
              <Card className="p-6 shadow-card">
                <Trophy className="h-6 w-6 text-primary" />
                <div className="mt-3 text-4xl font-bold">{pct}%</div>
                <div className="text-sm text-muted-foreground">Course complete</div>
              </Card>
            </div>

            <h2 className="mt-10 font-display text-xl font-bold">Modules</h2>
            <div className="mt-4 space-y-3">
              {modules.map((m, i) => {
                const done = completedIds.has(m.id);
                return (
                  <Card key={m.id} className="flex items-center gap-4 p-5 shadow-card">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg font-bold ${done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-sm text-muted-foreground">{m.description}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/lessons/$moduleId" params={{ moduleId: m.id }}><BookOpen className="mr-2 h-4 w-4" />Open</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/quiz/$moduleId" params={{ moduleId: m.id }}>Quiz</Link>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
