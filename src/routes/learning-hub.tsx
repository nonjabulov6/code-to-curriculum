import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Palette, Zap, Database, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learning-hub")({
  head: () => ({
    meta: [
      { title: "Learning Hub — LearnHub Tech" },
      { name: "description", content: "Open lessons for HTML, CSS, JavaScript and SQL with explanations, code examples, videos and practice exercises." },
      { property: "og:title", content: "Learning Hub — LearnHub Tech" },
      { property: "og:description", content: "Beginner-friendly lessons for HTML, CSS, JavaScript and SQL." },
    ],
  }),
  component: HubPage,
});

const topics = [
  { icon: Code, name: "HTML", desc: "Build the structure of every web page — from tags to semantic layouts.", color: "text-orange-500", video: "https://www.youtube.com/embed/qz0aGYrrlhU", starter: "<h1>Hello, world!</h1>\n<p>My first web page.</p>", exercise: "Create a page with your name as an <h1>, a short bio in a <p>, and a link to your favourite site." },
  { icon: Palette, name: "CSS", desc: "Make pages beautiful with colours, spacing, Flexbox and responsive layouts.", color: "text-blue-500", video: "https://www.youtube.com/embed/OEV8gMkCHXQ", starter: "body { font-family: system-ui; }\nh1 { color: royalblue; }", exercise: "Add a .card class with 20px padding, a light background and rounded corners." },
  { icon: Zap, name: "JavaScript", desc: "Make pages interactive with variables, functions and DOM events.", color: "text-yellow-500", video: "https://www.youtube.com/embed/W6NZfCO5SIk", starter: "const name = 'Nonjabulo';\nconsole.log('Hello, ' + name);", exercise: "Write a function double(n) that returns n * 2, and log double(7)." },
  { icon: Database, name: "SQL", desc: "Store, query and update data in tables with the language of databases.", color: "text-emerald-500", video: "https://www.youtube.com/embed/HXV3zeQKqGY", starter: "SELECT name, grade\nFROM students\nWHERE grade = 11;", exercise: "Write a query that returns the 5 oldest students, sorted by age descending." },
];

function HubPage() {
  return (
    <PageShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Learning Hub</h1>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">Open, self-paced lessons for the four core languages of web development.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        {topics.map((t) => (
          <Card key={t.name} className="overflow-hidden p-0 shadow-card">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-8">
                <t.icon className={`h-10 w-10 ${t.color}`} />
                <h2 className="mt-3 font-display text-2xl font-bold">{t.name} Basics</h2>
                <p className="mt-2 text-muted-foreground">{t.desc}</p>
                <h3 className="mt-6 text-sm font-semibold">Starter code</h3>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-xs"><code>{t.starter}</code></pre>
                <h3 className="mt-6 text-sm font-semibold">Practice exercise</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.exercise}</p>
                <Button asChild className="mt-6"><Link to="/course">Enroll to take the full quiz <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
              <div className="aspect-video md:aspect-auto">
                <iframe src={t.video} title={`${t.name} tutorial`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
