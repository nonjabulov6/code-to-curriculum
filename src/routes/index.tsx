import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Code2, Database, Palette, Sparkles, Users, Zap, Star } from "lucide-react";
import heroLearning from "@/assets/hero-learning.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnHub Tech — Learn Web Development, Free & Beginner-friendly" },
      { name: "description", content: "Master HTML, CSS, JavaScript and SQL with LearnHub Tech — a modern online learning platform for high school and first-year university students." },
    ],
  }),
  component: HomePage,
});

const modules = [
  { icon: Code2, title: "HTML Fundamentals", desc: "Structure content with semantic markup." },
  { icon: Palette, title: "CSS Fundamentals", desc: "Design beautiful, responsive layouts." },
  { icon: Zap, title: "JavaScript Fundamentals", desc: "Build interactive experiences." },
  { icon: Database, title: "SQL Fundamentals", desc: "Query and manage data confidently." },
];

const features = [
  { icon: BookOpen, title: "Hands-on lessons", desc: "Code examples and exercises for every concept." },
  { icon: Sparkles, title: "Track progress", desc: "See your completed modules and continue where you left off." },
  { icon: Users, title: "Built for learners", desc: "Designed for Grade 10–12 and first-year university students." },
];

const testimonials = [
  { name: "Thandi M.", role: "Grade 12 student", quote: "LearnHub made HTML and CSS finally click for me. The step-by-step exercises are the best." },
  { name: "Sipho K.", role: "First-year Computer Science", quote: "The SQL module gave me an edge in my database course. Highly recommend to any beginner." },
  { name: "Ayesha P.", role: "Self-learner", quote: "Clean interface, clear content. I finished the JavaScript module in a weekend." },
];

function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-subtle-gradient">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/10),transparent_50%)]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Web Development Fundamentals
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Learn to build the <span className="bg-hero-gradient bg-clip-text text-transparent">modern web</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              LearnHub Tech guides high school and first-year university learners through HTML, CSS, JavaScript and SQL — one clear module at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>Start learning free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/course">View the course</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-bold text-foreground">4</span> modules</div>
              <div><span className="font-bold text-foreground">8 weeks</span> pace</div>
              <div><span className="font-bold text-foreground">Beginner</span> friendly</div>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroLearning}
              alt="Students learning web development on laptops"
              width={1600}
              height={1000}
              className="rounded-2xl border border-border shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Course overview */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">One course. Four essential modules.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Everything you need to become confident with the fundamentals of web development.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Card key={m.title} className="group border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <m.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-hero-gradient text-primary-foreground shadow-elegant">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Loved by learners</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border bg-card p-6 shadow-card">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="overflow-hidden rounded-2xl bg-hero-gradient p-10 text-center text-primary-foreground shadow-elegant md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to start your web dev journey?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">Create a free account and dive into your first lesson today.</p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth" search={{ mode: "signup" }}>Enroll now — it's free</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
