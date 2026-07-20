import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Sparkles, Users, Star } from "lucide-react";
import heroLearning from "@/assets/hero-learning.jpg";
import moduleHtml from "@/assets/module-html.jpg";
import moduleCss from "@/assets/module-css.jpg";
import moduleJs from "@/assets/module-js.jpg";
import moduleSql from "@/assets/module-sql.jpg";

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
  { image: moduleHtml, title: "HTML Fundamentals", desc: "Structure content with semantic markup." },
  { image: moduleCss, title: "CSS Fundamentals", desc: "Design beautiful, responsive layouts." },
  { image: moduleJs, title: "JavaScript Fundamentals", desc: "Build interactive experiences." },
  { image: moduleSql, title: "SQL Fundamentals", desc: "Query and manage data confidently." },
];

const features = [
  { icon: BookOpen, title: "Hands-on lessons", desc: "Code examples and exercises for every concept." },
  { icon: Sparkles, title: "Track progress", desc: "See your completed modules and continue where you left off." },
  { icon: Users, title: "Built for learners", desc: "Designed for Grade 10–12 and first-year university students." },
];

const testimonials = [
  { name: "Lerato M.", role: "Grade 11 student", quote: "The HTML module was easy to follow, and the videos helped me understand coding for the first time." },
  { name: "Sipho D.", role: "Grade 12 student", quote: "The quizzes and practice exercises helped me build confidence in web development." },
  { name: "Ayesha P.", role: "First-year university", quote: "Clean interface, clear content. I finished the JavaScript module in a weekend." },
];

function HomePage() {
  return (
    <PageShell>
      {/* Hero — full-width photograph with dark overlay */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroLearning}
          alt="Students coding on laptops in a modern learning space"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-primary/40" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Web Development Fundamentals
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
              Learn to build the <span className="text-primary-glow">modern web</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              LearnHub Tech guides high school and first-year university learners through HTML, CSS, JavaScript and SQL — one clear module at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>Start learning free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white" asChild>
                <Link to="/course">View the course</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-8 text-sm text-white/70">
              <div><span className="font-bold text-white">4</span> modules</div>
              <div><span className="font-bold text-white">8 weeks</span> pace</div>
              <div><span className="font-bold text-white">Beginner</span> friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course overview with photographic module cards */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">One course. Four essential modules.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Everything you need to become confident with the fundamentals of web development.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Card key={m.title} className="group overflow-hidden border-border bg-card p-0 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={m.image}
                  alt={m.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/60 py-20 backdrop-blur">
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
