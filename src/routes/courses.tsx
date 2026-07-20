import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Clock, BarChart3 } from "lucide-react";
import moduleHtml from "@/assets/module-html.jpg";
import moduleCss from "@/assets/module-css.jpg";
import moduleJs from "@/assets/module-js.jpg";
import moduleSql from "@/assets/module-sql.jpg";

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

const moduleImages = [moduleHtml, moduleCss, moduleJs, moduleSql];

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
      <section className="relative isolate overflow-hidden">
        <img src={moduleJs} alt="Developer coding" width={1920} height={800} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-primary/40" />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center text-white">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Courses</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">All the beginner-friendly courses currently offered by LearnHub Tech.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {(q.data ?? []).map((c, i) => (
            <Card key={c.id} className="group overflow-hidden p-0 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={moduleImages[i % moduleImages.length]}
                  alt={c.title}
                  width={1200}
                  height={675}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold">{c.title}</h2>
                  <Badge variant="secondary">{c.difficulty}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />4 modules</span>
                </div>
                <Button asChild className="mt-5 w-full"><Link to="/course">View course</Link></Button>
              </div>
            </Card>
          ))}
          {q.data?.length === 0 && <p className="text-muted-foreground">No courses yet.</p>}
        </div>
      </section>
    </PageShell>
  );
}
