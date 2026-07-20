import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Clock, BarChart3 } from "lucide-react";
import modulesIcons from "@/assets/modules-icons.jpg";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — LearnHub Tech" },
      { name: "description", content: "Browse all available courses on LearnHub Tech." },
      { property: "og:title", content: "Courses — LearnHub Tech" },
      { property: "og:description", content: "Beginner web-development courses designed for learners." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const q = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("created_at");
      return data ?? [];
    },
  });
  return (
    <PageShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Courses</h1>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">All the beginner-friendly courses currently offered by LearnHub Tech.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <img src={modulesIcons} alt="HTML CSS JavaScript SQL icons" width={1400} height={900} loading="lazy" className="mx-auto mb-10 w-full max-w-3xl rounded-xl shadow-card" />
        <div className="grid gap-6 md:grid-cols-2">
          {(q.data ?? []).map((c) => (
            <Card key={c.id} className="p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{c.difficulty}</Badge>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />4 modules</span>
              </div>
              <Button asChild className="mt-5 w-full"><Link to="/course">View course</Link></Button>
            </Card>
          ))}
          {q.data?.length === 0 && <p className="text-muted-foreground">No courses yet.</p>}
        </div>
      </section>
    </PageShell>
  );
}
