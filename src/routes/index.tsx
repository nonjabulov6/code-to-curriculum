import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { ArrowRight, BookOpen, Sparkles, Users, Star, ChevronDown, Code2, Terminal, CheckCircle2 } from "lucide-react";
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
      { property: "og:title", content: "LearnHub Tech — Learn Web Development" },
      { property: "og:description", content: "Master HTML, CSS, JavaScript and SQL with LearnHub Tech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const learningPath = [
  { image: moduleHtml, title: "HTML Fundamentals", desc: "Structure content with semantic markup.", level: "Beginner", duration: "6 hours", lessons: 8, progress: 0 },
  { image: moduleCss, title: "CSS Fundamentals", desc: "Design beautiful, responsive layouts.", level: "Beginner", duration: "8 hours", lessons: 8, progress: 0 },
  { image: moduleJs, title: "JavaScript Fundamentals", desc: "Build interactive experiences.", level: "Intermediate", duration: "12 hours", lessons: 8, progress: 0 },
  { image: moduleSql, title: "SQL Fundamentals", desc: "Query and manage data confidently.", level: "Intermediate", duration: "6 hours", lessons: 8, progress: 0 },
];

const trustedLogos = ["Grade 10–12 Schools", "University Prep", "Coding Clubs", "STEM Programs", "Career Bootcamps"];

const exercises = [
  { icon: Code2, title: "Write real HTML", desc: "Build a semantic profile page from scratch in your browser." },
  { icon: Terminal, title: "Style live", desc: "Tweak CSS variables and watch a layout transform in real time." },
  { icon: Sparkles, title: "Script it", desc: "Solve small JS challenges with instant feedback." },
];

const projects = [
  { title: "Personal portfolio", author: "Lerato M.", tags: ["HTML", "CSS"], image: moduleHtml },
  { title: "Weather widget", author: "Sipho D.", tags: ["JavaScript", "API"], image: moduleJs },
  { title: "Student database", author: "Ayesha P.", tags: ["SQL"], image: moduleSql },
];

const faqs = [
  { q: "Is LearnHub Tech really free?", a: "Yes — every module, quiz, and the final exam are free for learners." },
  { q: "Do I need prior experience?", a: "No. The HTML module starts from zero and builds up gradually." },
  { q: "How long does the course take?", a: "Most learners finish in 6–8 weeks studying a few hours per week." },
  { q: "Do I get a certificate?", a: "Yes — pass the final exam and download a personalised completion certificate." },
];

const testimonials = [
  { name: "Lerato M.", role: "Grade 11 student", quote: "The HTML module was easy to follow, and the videos helped me understand coding for the first time." },
  { name: "Sipho D.", role: "Grade 12 student", quote: "The quizzes and practice exercises helped me build confidence in web development." },
  { name: "Ayesha P.", role: "First-year university", quote: "Clean interface, clear content. I finished the JavaScript module in a weekend." },
];

function HomePage() {
  return (
    <PageShell>
      {/* Hero — ~70vh with dark overlay + scroll indicator */}
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
        <img
          src={heroLearning}
          alt="Students coding on laptops in a modern learning space"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-primary/40" />
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="max-w-2xl text-white animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Web Development Fundamentals
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
              Learn to build the <span className="text-primary-glow">modern web</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              LearnHub Tech guides high school and first-year university learners through HTML, CSS, JavaScript and SQL — one clear lesson at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="rounded-2xl">
                <Link to="/auth" search={{ mode: "signup" }}>Start learning free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white" asChild>
                <Link to="/course">View the course</Link>
              </Button>
            </div>
          </div>
        </div>
        <a href="#learning-path" aria-label="Scroll to learning path" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 animate-scroll-bounce">
          <ChevronDown className="h-7 w-7" />
        </a>
      </section>

      {/* Trusted by learners */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Trusted by learners across</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedLogos.map((t) => (
              <span key={t} className="text-sm font-medium text-muted-foreground/80">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section id="learning-path" className="bg-surface-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Learning path</span>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">A clear path from zero to confident</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Four essential modules. Micro-lessons under 8 minutes each. Practice as you go.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningPath.map((m, i) => (
              <Reveal key={m.title} delay={i * 90}>
                <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-border bg-card p-0 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elegant">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={m.image} alt={m.title} width={1200} height={675} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{m.level}</span>
                      <span>· {m.duration}</span>
                      <span>· {m.lessons} lessons</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold">{m.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{m.desc}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span><span>{m.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${m.progress}%` }} />
                      </div>
                    </div>
                    <Button asChild className="mt-5 w-full rounded-xl">
                      <Link to="/courses">Continue learning</Link>
                    </Button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Coding Exercises */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Interactive</span>
                <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Learn by doing, not just watching</h2>
                <p className="mt-3 text-muted-foreground">Every lesson pairs a short 3–8 minute video with a hands-on exercise and a quick knowledge check — so concepts stick.</p>
                <ul className="mt-6 space-y-3">
                  {exercises.map((e) => (
                    <li key={e.title} className="flex gap-3">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><e.icon className="h-5 w-5" /></span>
                      <div>
                        <div className="font-semibold">{e.title}</div>
                        <p className="text-sm text-muted-foreground">{e.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="overflow-hidden rounded-2xl border-border bg-slate-950 p-0 shadow-elegant">
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  <span className="ml-3 text-xs text-slate-400">index.html</span>
                </div>
                <pre className="overflow-x-auto p-5 text-sm text-slate-50 font-mono leading-relaxed">
{`<!doctype html>
<html lang="en">
  <head>
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, web!</h1>
    <p>I'm learning at LearnHub Tech.</p>
  </body>
</html>`}
                </pre>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Student Projects */}
      <section className="bg-surface-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Student work</span>
                <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Projects built by our learners</h2>
              </div>
              <Link to="/learning-hub" className="hidden text-sm font-medium text-primary hover:underline sm:inline">View more →</Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <Card className="group overflow-hidden rounded-2xl border-border bg-card p-0 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elegant">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={p.image} alt={p.title} width={1200} height={675} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">by {p.author}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <Reveal>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <Card className="rounded-2xl border-border p-6 shadow-card transition hover:shadow-elegant">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold">{f.q}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Loved by learners</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <Card className="h-full rounded-2xl border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                  <div className="mt-4">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 overflow-hidden rounded-2xl bg-hero-gradient p-10 text-center text-primary-foreground shadow-elegant md:p-14">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to start your web dev journey?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">Create a free account and dive into your first lesson today.</p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="rounded-2xl" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>Enroll now — it's free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fallback icon reference to avoid unused warnings */}
      <div className="hidden">
        <BookOpen /><Users />
      </div>
    </PageShell>
  );
}
