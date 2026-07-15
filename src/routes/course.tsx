import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Clock, Trophy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/course")({
  head: () => ({
    meta: [
      { title: "Web Development Fundamentals — LearnHub Tech" },
      { name: "description", content: "Web Development Fundamentals: 4 modules covering HTML, CSS, JavaScript and SQL. Beginner-friendly, 8 weeks, free to enroll." },
      { property: "og:title", content: "Web Development Fundamentals — LearnHub Tech" },
      { property: "og:description", content: "HTML · CSS · JavaScript · SQL. 4 modules, beginner level." },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const courseQ = useQuery({
    queryKey: ["course-with-modules"],
    queryFn: async () => {
      const { data: course, error } = await supabase.from("courses").select("*").eq("slug", "web-development-fundamentals").maybeSingle();
      if (error) throw error;
      if (!course) return null;
      const { data: modules } = await supabase.from("modules").select("*").eq("course_id", course.id).order("position");
      return { course, modules: modules ?? [] };
    },
  });

  const enrolledQ = useQuery({
    queryKey: ["my-enrollment", courseQ.data?.course.id, user?.id],
    enabled: !!user && !!courseQ.data?.course.id,
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("id").eq("user_id", user!.id).eq("course_id", courseQ.data!.course.id).maybeSingle();
      return !!data;
    },
  });

  const enroll = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("enrollments").insert({ user_id: user.id, course_id: courseQ.data!.course.id });
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: () => {
      toast.success("Enrolled! Welcome aboard.");
      qc.invalidateQueries({ queryKey: ["my-enrollment"] });
      navigate({ to: "/dashboard" });
    },
    onError: (e) => toast.error(e.message),
  });

  if (courseQ.isLoading) return <PageShell><div className="p-20 text-center text-muted-foreground">Loading course…</div></PageShell>;
  if (!courseQ.data) return <PageShell><div className="p-20 text-center">Course not found.</div></PageShell>;

  const { course, modules } = courseQ.data;
  const enrolled = enrolledQ.data;

  return (
    <PageShell>
      <section className="bg-subtle-gradient">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.difficulty}</Badge>
            <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />{course.duration}</Badge>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{course.description}</p>
          <div className="mt-8">
            {user ? (
              enrolled ? (
                <Button size="lg" asChild><Link to="/dashboard">Continue learning</Link></Button>
              ) : (
                <Button size="lg" onClick={() => enroll.mutate()} disabled={enroll.isPending}>
                  {enroll.isPending ? "Enrolling…" : "Enroll now — free"}
                </Button>
              )
            ) : (
              <Button size="lg" asChild><Link to="/auth" search={{ mode: "signup" }}>Sign up to enroll</Link></Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold">Course modules</h2>
        <div className="mt-6 space-y-4">
          {modules.map((m, i) => (
            <Card key={m.id} className="flex items-start gap-4 p-6 shadow-card transition hover:border-primary/40">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              </div>
              {enrolled && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/lessons/$moduleId" params={{ moduleId: m.id }}>Open</Link>
                </Button>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="p-6 shadow-card"><BookOpen className="h-6 w-6 text-primary" /><h4 className="mt-3 font-semibold">Guided lessons</h4><p className="mt-1 text-sm text-muted-foreground">Bite-sized content with code examples.</p></Card>
          <Card className="p-6 shadow-card"><CheckCircle2 className="h-6 w-6 text-primary" /><h4 className="mt-3 font-semibold">Quizzes</h4><p className="mt-1 text-sm text-muted-foreground">Test yourself after each module.</p></Card>
          <Card className="p-6 shadow-card"><Trophy className="h-6 w-6 text-primary" /><h4 className="mt-3 font-semibold">Progress tracking</h4><p className="mt-1 text-sm text-muted-foreground">See how far you've come.</p></Card>
        </div>
      </section>
    </PageShell>
  );
}
