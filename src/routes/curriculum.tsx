import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Palette, Zap, Database, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Curriculum — LearnHub Tech" },
      { name: "description", content: "Explore the full LearnHub Tech curriculum: HTML, CSS, JavaScript and SQL fundamentals for high school and first-year students." },
      { property: "og:title", content: "Curriculum — LearnHub Tech" },
      { property: "og:description", content: "Four beginner-friendly modules covering the foundations of modern web development." },
    ],
  }),
  component: CurriculumPage,
});

const modules = [
  { icon: Code, title: "Module 1: HTML Fundamentals", color: "text-orange-500", lessons: 8, topics: ["Tags & attributes", "Headings & paragraphs", "Links & images", "Lists & tables", "Forms & inputs", "Semantic HTML"] },
  { icon: Palette, title: "Module 2: CSS Fundamentals", color: "text-blue-500", lessons: 8, topics: ["Selectors", "Colours & fonts", "The box model", "Flexbox", "CSS Grid", "Responsive design"] },
  { icon: Zap, title: "Module 3: JavaScript Fundamentals", color: "text-yellow-500", lessons: 8, topics: ["Variables & data types", "Operators & conditions", "Loops", "Functions", "Arrays & objects", "DOM & events"] },
  { icon: Database, title: "Module 4: SQL Fundamentals", color: "text-emerald-500", lessons: 8, topics: ["Databases & tables", "CREATE & INSERT", "SELECT & WHERE", "ORDER BY & LIMIT", "UPDATE & DELETE", "JOIN & GROUP BY"] },
];

function CurriculumPage() {
  return (
    <PageShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 opacity-90" />
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Curriculum</h1>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">
            A step-by-step path from zero to your first real websites. 4 modules · 32 lessons · 40 quiz questions · 1 final exam.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((m) => (
            <Card key={m.title} className="p-6 shadow-card">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <h2 className="mt-3 font-display text-xl font-bold">{m.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{m.lessons} lessons · 10-question quiz</p>
              <ul className="mt-4 space-y-2 text-sm">
                {m.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-subtle-gradient p-8 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold">Final Examination</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            After completing all four modules, unlock a 40-question final exam (10 from each module).
            Pass with 70% or higher to earn your Certificate of Completion.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to="/course">Enroll now</Link></Button>
            <Button variant="outline" asChild><Link to="/learning-hub">Browse the Learning Hub</Link></Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
